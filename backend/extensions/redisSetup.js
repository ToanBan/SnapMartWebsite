const redisClient = require("./redis");

const setupRedisIndex = async () => {
  try {
    const indexExists = await redisClient.sendCommand(["FT._LIST"]);
    if (!indexExists.includes("idx_products")) {
      await redisClient.sendCommand([
        "FT.CREATE",
        "idx_products",
        "ON",
        "HASH",
        "PREFIX",
        "1",
        "product:",
        "SCHEMA",
        "vector",
        "VECTOR",
        "FLAT",
        "768",
        "TYPE",
        "FLOAT32",
        "DISTANCE_METRIC",
        "COSINE"
      ]);
      console.log("Redis index idx_products created!");
    } else {
      console.log("Redis index idx_products already exists.");
    }
  } catch (err) {
    console.error("Error setting up Redis index:", err);
  }
};

module.exports = setupRedisIndex;