const redis = require("redis");

// const redisClient = redis.createClient({
//   socket: {
//     host: "localhost",
//     port: 6379,
//     reconnectStrategy: (retries) => Math.min(retries * 50, 2000),
//   },
//   legacyMode: true,
// });

const redisClient = redis.createClient({
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

redisClient.on("connect", () => {
  console.log("Redis socket connected");
});

redisClient.on("ready", () => {
  console.log("Redis ready");
});

redisClient.on("error", (err) => {
  console.error("Redis Error:", err);
});

const setupRedisIndex = async () => {
  try {
    const indices = await redisClient.sendCommand(["FT._LIST"]);
    console.log("Indices:", indices);

    if (!indices.includes("idx_products")) {
      await redisClient.sendCommand([
        "FT.CREATE",
        "idx_products",
        "ON",
        "HASH",
        "PREFIX",
        "1",
        "product:",
        "SCHEMA",
        "embedding",
        "VECTOR",
        "FLAT",
        "6",
        "DIM",
        "768",
        "TYPE",
        "FLOAT32",
        "DISTANCE_METRIC",
        "COSINE",
      ]);

      console.log("Redis index idx_products created!");
    } else {
      console.log("Redis index already exists");
    }
  } catch (err) {
    console.error("Error setting up Redis index:", err);
  }
};

(async () => {
  try {
    await redisClient.connect();
    await redisClient.sendCommand(["PING"]);
    console.log("PING OK");
    await setupRedisIndex();
  } catch (err) {
    console.error("Redis connection/setup failed:", err);
  }
})();

module.exports = redisClient;
