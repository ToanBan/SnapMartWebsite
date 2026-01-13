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

  const dataForPython = products.map((p) => ({
    id: p.id,
    text: `${p.productName} ${p.description}`,
  }));

  fs.writeFileSync(
    "data/products_for_embeddings.json",
    JSON.stringify(dataForPython, null, 2)
  );
  console.log("Exported products for embedding:", dataForPython.length);
};

const ACTION_WEIGHT = {
  view: 1,
  search: 2,
  "add-cart": 4,
  "buy-products": 6,
};

const RecommendByCBF = async (req, res, next) => {
  try {
    const userId = String(req.user.id);
    const { actions } = req.body;
    if (!Array.isArray(actions)) {
      return res.status(400).json({ message: "actions must be an array" });
    }
    let userText = [];
    for (const act of actions) {
      const weight = ACTION_WEIGHT[act.type] || 1;

      if (Array.isArray(act.productIds)) {
        for (const pid of act.productIds) {
          const product = await Product.findByPk(pid);
          if (product) {
            for (let i = 0; i < weight; i++) {
              userText.push(
                `${product.productName} ${product.description || ""}`
              );
            }
          }
        }
      }
      if (act.productId) {
        const product = await Product.findByPk(act.productId);
        if (product) {
          for (let i = 0; i < weight; i++) {
            userText.push(
              `${product.productName} ${product.description || ""}`
            );
          }
        }
      }

      if (act.type === "search" && act.query) {
        for (let i = 0; i < weight; i++) {
          userText.push(act.query);
        }
      }
    }

    if (userText.length === 0) {
      return res.json({ recommendProductIds: [] });
    }
    const finalText = userText.join(" ");
    const python = spawn("python", [pythonPath, finalText]);
    let output = "";
    let errorOutput = "";
    python.stdout.on("data", (data) => {
      output += data.toString();
    });

    python.stderr.on("data", (err) => {
      errorOutput += err.toString();
    });

    python.on("close", async (code) => {
      if (code !== 0) {
        console.error("Python error:", errorOutput);
        return res.status(500).json({ message: "Embedding failed" });
      }
      const embedding = JSON.parse(output);

      if (!Array.isArray(embedding) || embedding.length !== 768) {
        console.error("Invalid embedding length:", embedding.length);
        return res.status(500).json({ message: "Invalid embedding" });
      }
      const vectorBuffer = Buffer.from(new Float32Array(embedding).buffer);
      const result = await redisClient.sendCommand([
        "FT.SEARCH",
        "idx_products",
        "*=>[KNN 5 @embedding $vec AS score]",
        "PARAMS",
        "2",
        "vec",
        vectorBuffer,
        "SORTBY",
        "score",
        "RETURN",
        "2",
        "score",
        "product_id",
        "DIALECT",
        "2",
      ]);
      const ids = [];
      for (let i = 1; i < result.length; i += 2) {
        const key = result[i];
        if (typeof key === "string" && key.includes(":")) {
          ids.push(Number(key.split(":")[1]));
        }
      }

      return res.json({
        recommendProductIds: ids,
      });
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const SuggestionProduct = async (req, res, next) => {
  try {
    const { productsIds } = req.body;
    const products = await Product.findAll({
      where: {
        status: "approved",
        id: {
          [Op.in]: productsIds,
        },
      },
      limit:5,
      include: [
        {
          model: Business,
          as: "business",
          attributes: ["id", "businessName", "email", "phone", "address"],
        },
      ],
    });

    if(!products){
      return res.status(404).json({
        message:"not found"
      })
    }

    return res.status(200).json({
      message:products
    })
  } catch (error) {
    next(error);
  }
};

module.exports = {
  InsertProducts,
  exportProductsJson,
  RecommendByCBF,
  SuggestionProduct,
};
