const { GoogleGenAI } = require("@google/genai");
const { Product, Business } = require("../models");
const { where, Op } = require("sequelize");

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_APIKEY });

const IntentQuestion = async (caption) => {
  try {
    const prompt = `
Bạn là bộ phân loại intent.

Phân loại câu hỏi sau vào 1 trong các loại:
- PRODUCT_QUERY: hỏi sản phẩm cụ thể, giá, brand, filter
- PRODUCT_ADVICE: cần tư vấn, gợi ý sản phẩm phù hợp
- GENERAL_QUESTION: kiến thức chung, không cần dữ liệu hệ thống

Chỉ trả về JSON, KHÔNG GIẢI THÍCH.

User question:
"${caption}"
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-lite",
      contents: prompt,
      temperature: 0,
    });

    const text = response?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return null;

    const json = JSON.parse(match[0]);
    return json.intent;
  } catch (err) {
    console.error("❌ Intent LLM lỗi:", err);
    return null;
  }
};

const ExtractProductFilter = async (caption) => {
  try {
    const prompt = `
Bạn là hệ thống trích xuất bộ lọc sản phẩm cho database.

Trả về JSON theo schema:
{
  "product_name": string | null,
  "category": string | null,
  "brand": string | null,
  "price_min": number | null,
  "price_max": number | null,
  "sort_by": "BEST_SELLER" | "LEAST_SELLER" | "PRICE_ASC" | "PRICE_DESC" | null,
  "limit": number | null
}

Quy ước:
- "giá dưới X" => price_max = X
- "giá trên X" => price_min = X
- "mua nhiều" => sort_by = BEST_SELLER
- "ít người mua" => sort_by = LEAST_SELLER
- "giá tăng dần" => PRICE_ASC
- "giá giảm dần" => PRICE_DESC
- nếu yêu cầu liệt kê => limit = 5

Chỉ trả JSON. Không giải thích.

User:
"${caption}"
`;

    const res = await ai.models.generateContent({
      model: "gemini-2.0-flash-lite",
      contents: prompt,
      temperature: 0,
    });

    const text = res?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const match = text.match(/\{[\s\S]*\}/);

    if (!match) return null;

    return JSON.parse(match[0]);
  } catch (err) {
    console.error("ExtractProductFilter error:", err);
    return null;
  }
};

const AnswerFromDB = async (caption) => {
  const filter = await ExtractProductFilter(caption);

  if (!filter) {
    return {
      type: "TEXT",
      message: "Mình chưa hiểu rõ yêu cầu của bạn 😅",
    };
  }

  const where = {};
  if (filter.product_name) {
    where.productName = {
      [Op.like]: `%${filter.product_name}%`,
    };
  }

  if (filter.price_min || filter.price_max) {
    where.price = {};
    if (filter.price_min) where.price[Op.gte] = filter.price_min;
    if (filter.price_max) where.price[Op.lte] = filter.price_max;
  }

  const order = [];
  if (filter.sort_by === "BEST_SELLER") order.push(["soldCount", "DESC"]);
  if (filter.sort_by === "LEAST_SELLER") order.push(["soldCount", "ASC"]);
  if (filter.sort_by === "PRICE_ASC") order.push(["price", "ASC"]);
  if (filter.sort_by === "PRICE_DESC") order.push(["price", "DESC"]);

  let products = [];
  if (filter.brand) {
    const businesses = await Business.findAll({
      where: {
        businessName: {
          [Op.like]: `%${filter.brand}%`,
        },
      },
      include: [
        {
          model: Product,
          as: "products",
          where,
          order,
          limit: filter.limit || 5,
        },
      ],
    });

    products = businesses.flatMap((b) => b.products || []);
  }
  // 🔹 Không có brand → query trực tiếp Product
  else {
    products = await Product.findAll({
      where,
      order,
      limit: filter.limit || 5,
    });
  }

  if (!products.length) {
    return {
      type: "TEXT",
      message: "❌ Không tìm thấy sản phẩm phù hợp với yêu cầu của bạn.",
    };
  }

  return {
    type: "COURSE_LIST",
    message: `Mình tìm được ${products.length} khóa học phù hợp cho bạn 👇`,
    courses: products.map((p) => ({
      id: p.id,
      productName: p.productName,
      price: p.price,
    })),
  };
};

const AnswerFromOpenAI = async (caption) => {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-lite",
    contents: caption,
    temperature: 0.4,
  });

  const text = response?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  const match = text.match(/\{[\s\S]*\}/);

  if (!match) return null;
  const message = JSON.parse(match[0]);
  return {
    type: "TEXT",
    message
  };
};

const AnswerAdivce = async (caption) => {
  const filter = await ExtractProductFilter(caption);

  if (!filter) {
    return {
      type: "TEXT",
      message: "Xin lỗi, mình chưa hiểu yêu cầu của bạn.",
    };
  }

  if (!filter.product_name) {
    return {
      type: "TEXT",
      message: "Bạn đang muốn tìm khóa học về lĩnh vực nào?",
    };
  }

  const products = await Product.findAll({
    where: {
      productName: {
        [Op.like]: `%${filter.product_name}%`,
      },
    },
    limit: 5,
  });

  if (!products.length) {
    return {
      type: "TEXT",
      message: "Mình chưa tìm thấy khóa học phù hợp 😥",
    };
  }

  return {
    type: "ADVICE",
    message: "Mình tìm thấy các khóa học sau 👇",
    courses: products.map((p) => ({
      id: p.id,
      name: p.productName,
      price: p.price,
    })),
    showActions: true,
  };
};

const ResponseToUser = async (req, res, next) => {
  try {
    const { caption } = req.body;
    const intent = await IntentQuestion(caption);
    if (!intent) {
      
      return res.status(200).json({
        type:"TEXT", 
        message:"Xin Lỗi Mình Chưa Hiểu Câu Hỏi Của Bạn"
      })
    }
    let reply;
    switch (intent) {
      case "PRODUCT_QUERY":
        reply = await AnswerFromDB(caption);
        break;
      case "PRODUCT_ADVICE":
        reply = await AnswerAdivce(caption);
        break;

      case "GENERAL_QUESTION":
        reply = await AnswerFromOpenAI(caption);
        break;
      default:
        reply = "Mình chưa hỗ trợ câu hỏi này.";
    }

    return res.json({
      intent,
      reply,
    });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

module.exports = {
  ResponseToUser,
};
