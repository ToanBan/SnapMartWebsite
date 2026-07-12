require("dotenv").config();
const cron = require("node-cron");
const CheckBalanceTransaction = require("./CheckBalanceTransaction");
const EmbeddingSchedule = require("./EmbeddingSchedule");

cron.schedule("* * * * *", async () => {
  console.log("Running CheckBalanceTransaction cron job...");
  await CheckBalanceTransaction();
});

// Chạy lúc 2:00 sáng mỗi ngày để index sản phẩm mới vào Redis
cron.schedule("0 2 * * *", async () => {
  console.log("[Cron] Running EmbeddingSchedule...");
  await EmbeddingSchedule();
});

async function run() {
    await CheckBalanceTransaction();
    console.log("CheckBalanceTransaction executed manually.");
}

run();