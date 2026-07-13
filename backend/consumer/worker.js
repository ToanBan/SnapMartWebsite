const { connect, consumeFromQueue } = require("../extensions/rabbitmq");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const startWorker = async () => {
  try {
    console.log("Starting RabbitMQ Consumer Worker...");
    console.log("[Worker] REDIS_HOST:", process.env.REDIS_HOST);
    console.log("[Worker] REDIS_PORT:", process.env.REDIS_PORT);
    
    // Khởi tạo kết nối RabbitMQ
    await connect();

const { Product } = require("../models");
const redisClient = require("../extensions/redis");
const { spawn } = require("child_process");

const ACTION_WEIGHT = {
  view: 1,
  search: 2,
  "add-cart": 4,
  "buy-products": 6,
};
const pythonPath = path.join(__dirname, "../generate/encode_query.py");

    // Callback xử lý khi nhận được message
    const processAction = async (message) => {
      try {
        console.log(`[x] Received task for User ID: ${message.userId}`);
        const { userId, actions } = message;

        if (!Array.isArray(actions) || actions.length === 0) {
          return true; // No actions to process
        }

        let userText = [];
        for (const act of actions) {
          const weight = ACTION_WEIGHT[act.type] || 1;

          if (Array.isArray(act.productIds)) {
            for (const pid of act.productIds) {
              const product = await Product.findByPk(pid);
              if (product) {
                for (let i = 0; i < weight; i++) {
                  userText.push(`${product.productName} ${product.description || ""}`);
                }
              }
            }
          }
          if (act.productId) {
            const product = await Product.findByPk(act.productId);
            if (product) {
              for (let i = 0; i < weight; i++) {
                userText.push(`${product.productName} ${product.description || ""}`);
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
          console.log(`[!] No text generated for User ID: ${userId}`);
          return true;
        }

        const finalText = userText.join(" ");
        
        return new Promise((resolve, reject) => {
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
              return reject(new Error("Embedding failed"));
            }

            try {
              const embedding = JSON.parse(output);

              if (!Array.isArray(embedding) || embedding.length !== 768) {
                console.error("Invalid embedding length:", embedding.length);
                return reject(new Error("Invalid embedding"));
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

              console.log(`[v] Found ${ids.length} recommendations for User ID: ${userId}`);

              // Cache in Redis for 1 day (86400 seconds)
              await redisClient.set(`recommend:user:${userId}`, JSON.stringify(ids), {
                EX: 86400,
              });

              console.log(`[+] Cached recommendations for User ID: ${userId} in Redis. ${ids.join(", ")}`);

              resolve(true);
            } catch (err) {
              console.error("Error processing python output or redis search", err);
              reject(err);
            }
          });
        });

      } catch (error) {
        console.error("Error processing message in worker:", error);
        return false; // return false để nack message
      }
    };

    // Bắt đầu lắng nghe queue 'user_actions' với prefetch = 1
    await consumeFromQueue("user_actions", processAction, 1);
    
    console.log("Worker is running and waiting for messages...");
  } catch (error) {
    console.error("Failed to start worker:", error);
    process.exit(1);
  }
};

startWorker();
