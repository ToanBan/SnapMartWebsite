require("dotenv").config();
const cron = require("node-cron");
const CheckBalanceTransaction = require("./CheckBalanceTransaction");

cron.schedule("* * * * *", async () => {
  console.log("Running CheckBalanceTransaction cron job...");
  await CheckBalanceTransaction();
});

async function run() {
    await CheckBalanceTransaction();
    console.log("CheckBalanceTransaction executed manually.");
}

run();