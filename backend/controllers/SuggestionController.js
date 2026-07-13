const { where, Op } = require("sequelize");
const { Product, Business } = require("../models");
const fs = require("fs");
const redisClient = require("../extensions/redis");
const { spawn } = require("child_process");
const path = require("path");
const message = require("../models/message");
const pythonPath = path.join(__dirname, "../generate/encode_query.py");

const InsertProducts = async () => {
  try {
    const products = [];

    for (let i = 301; i <= 13000; i++) {
      const businessId = [4, 5, 6][Math.floor(Math.random() * 3)];
      const price = (Math.random() * 990 + 10).toFixed(2);
      const stock = Math.floor(Math.random() * 100) + 1;

      products.push({
        businessId,
        productName: `Product ${i}`,
        price,
        description: `Description for product ${i}`,
        image: "1763194305998-chungchi.jpg",
        status: "approved",
        stock,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    await Product.bulkCreate(products);
    console.log("Inserted 300 products successfully!");
    return;
  } catch (error) {
    console.error("Error inserting products:", error);
  }
};

const exportProductsJson = async () => {
  const products = await Product.findAll({
    where: { status: "approved", stock: { [Op.gt]: 0 } },
    attributes: ["id", "productName", "description"],
  });

  // Kiểm tra Redis để lọc chỉ sản phẩm mới (chưa có vector)
  const newProducts = [];
  for (const p of products) {
    const exists = await redisClient.exists(`product:${p.id}`);
    if (!exists) {
      newProducts.push({
        id: p.id,
        text: `${p.productName} ${p.description || ""}`,
      });
    }
  }

  if (newProducts.length === 0) {
    console.log("[Embedding] Không có sản phẩm mới cần xử lý.");
    return 0;
  }

  fs.writeFileSync(
    "data/products_for_embeddings.json",
    JSON.stringify(newProducts, null, 2)
  );
  console.log(`[Embedding] Đã ghi ${newProducts.length} sản phẩm mới vào file JSON.`);
  return newProducts.length;
};

const ACTION_WEIGHT = {
  view: 1,
  search: 2,
  "add-cart": 4,
  "buy-products": 6,
};

const rabbitmq = require("../extensions/rabbitmq");

const TrackUserAction = async (req, res, next) => {
  try {
    const userId = String(req.user.id);
    const { actions } = req.body;
    
    if (!Array.isArray(actions)) {
      return res.status(400).json({ message: "actions must be an array" });
    }

    await rabbitmq.publishToQueue("user_actions", {
      userId: userId,
      actions: actions
    });

    return res.status(200).json({ message: "Action tracked successfully" });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const GetRecommendations = async (req, res, next) => {
  try {
    const userId = String(req.user.id);
    
    console.log("[GetRecommendations] Fetching recommendations for User ID:", userId);
    console.log("[GetRecommendations] Redis config - host:", process.env.REDIS_HOST, "port:", process.env.REDIS_PORT);

    // Đọc từ Redis cache (do worker đã cache)
    const cachedIdsString = await redisClient.get(`recommend:user:${userId}`);
    
    if (!cachedIdsString) {
      console.log(`[GetRecommendations] No cached recommendations found for User ID: ${userId} in Redis`);
      return res.status(200).json({
        message: [], 
        userId
      });
    }

    console.log(`[GetRecommendations] Raw cached data from Redis:`, cachedIdsString);

    let productsIds = [];
    try {
      productsIds = JSON.parse(cachedIdsString);
    } catch (e) {
      console.error("Failed to parse cachedIds", e);
    }

    if (!Array.isArray(productsIds) || productsIds.length === 0) {
       return res.status(200).json({
        message: [], 
        userId
      });
    }

    console.log(`[+] Backend Retrieved recommendations for User ID: ${userId} from Redis. ${productsIds.join(", ")}`);

    const products = await Product.findAll({
      where: {
        status: "approved",
        id: {
          [Op.in]: productsIds,
        },
      },
      limit: 5,
      include: [
        {
          model: Business,
          as: "business",
          attributes: ["id", "businessName", "email", "phone", "address"],
        },
      ],
    });

    return res.status(200).json({
      message: products, 
      userId
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  InsertProducts,
  exportProductsJson,
  TrackUserAction,
  GetRecommendations,
};
