require("dotenv").config();
const EmbeddingSchedule = require("./EmbeddingSchedule");

(async () => {
  console.log("[runEmbedding] === Bắt đầu chạy embedding thủ công ===");
  try {
    await EmbeddingSchedule();
    console.log("[runEmbedding] === Hoàn thành! ===");
  } catch (err) {
    console.error("[runEmbedding] Lỗi:", err.message);
    process.exit(1);
  }
  process.exit(0);
})();