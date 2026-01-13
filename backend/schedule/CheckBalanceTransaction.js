require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { Order, OrderItem, Product, Business } = require("../models");

const CheckBalanceTransaction = async () => {
  try {
    const orders = await Order.findAll({
      where: {
        payment_status: "paid",
        payout_status: "pending",
      },
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
              include: [
                {
                  model: Business,
                  as: "business",
                },
              ],
            },
          ],
        },
      ],
    });

    if (!orders.length) return;
    const balance = await stripe.balance.retrieve();
    const availableUsd =
      balance.available.find((b) => b.currency === "usd")?.amount || 0;

    let usedAmount = 0;

    for (const order of orders) {
      const businessMap = {};

      for (const item of order.items) {
        const product = item.product;
        const business = product?.business;

        if (!business?.bank_account_Id) continue;

        if (!businessMap[business.id]) {
          businessMap[business.id] = {
            business,
            amount: 0,
          };
        }

        businessMap[business.id].amount += product.price * item.quantity;
      }

      for (const bid in businessMap) {
        const { business, amount } = businessMap[bid];

        const platformFee = Math.round(amount * 0.1);
        const sellerAmount = Math.round((amount - platformFee) * 100);

        if (sellerAmount <= 0) continue;
        if (usedAmount + sellerAmount > availableUsd) break;

        try {
          const transfer = await stripe.transfers.create({
            amount: sellerAmount,
            currency: "usd",
            destination: business.bank_account_Id,
          });

          usedAmount += sellerAmount;

          console.log(`TRANSFER OK | Business ${business.id} | ${transfer.id}`);
        } catch (err) {
          console.error(
            `TRANSFER FAIL | Business ${business.id}`,
            err.raw?.message || err.message
          );
        }
      }
      await order.update({ payout_status: "paid" });
    }
  } catch (err) {
    console.error("CRON ERROR:", err.message);
  }
};

module.exports = CheckBalanceTransaction;
