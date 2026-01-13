const { CartItem, Product, Order, OrderItem, Business } = require("../models");
const { Op, or, where } = require("sequelize");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

const CreateCheckoutController = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const {
      selectedItems,
      address,
      phone,
      method,
      quantityUpdatedItemsFiltered,
    } = req.body;

    if (!Array.isArray(selectedItems) || selectedItems.length === 0) {
      return res.status(400).json({ message: "Không có sản phẩm!" });
    }
    const cartItemIds = selectedItems.map((i) => i.id);

    const cartItems = await CartItem.findAll({
      where: {
        user_id: userId,
        id: { [Op.in]: cartItemIds },
      },
      include: [{ model: Product, as: "product" }],
    });

    if (!cartItems.length) {
      return res.status(400).json({ message: "Cart rỗng!" });
    }

    const businessMap = {};
    cartItems.forEach((ci) => {
      const bid = ci.product.businessId;
      if (!businessMap[bid]) businessMap[bid] = [];
      businessMap[bid].push(ci);
    });

    let orderId;

    if (method === "cod") {
      for (const businessId of Object.keys(businessMap)) {
        const items = businessMap[businessId];
        let totalAmount = 0;
        items.forEach((ci) => (totalAmount += ci.product.price * ci.quantity));

        const order = await Order.create({
          user_id: userId,
          business_id: Number(businessId),
          total_amount: totalAmount,
          payment_status: "pending",
          payout_status: "pending",
          address,
          phone_number: phone,
        });

        orderId = order.id;

        for (const ci of items) {
          await OrderItem.create({
            order_id: order.id,
            product_id: ci.product_id,
            quantity:
              quantityUpdatedItemsFiltered.find((q) => q.id === ci.id)
                ?.quantity || ci.quantity,
            price: ci.product.price,
          });

          await CartItem.destroy({ where: { id: ci.id } });
        }
      }

      return res.status(200).json({
        success: true,
        method: "cod",
        orderId,
      });
    }

    const line_items = cartItems.map((ci) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: ci.product.productName,
        },
        unit_amount: Math.round(ci.product.price * 100),
      },
      quantity: ci.quantity,
    }));

    const metadata = {
      userId: String(userId),
      businessBreakdown: JSON.stringify(
        Object.keys(businessMap).map((bid) => ({
          businessId: bid,
          productIds: businessMap[bid].map((ci) => ci.product_id),
        }))
      ),
      address: String(address),
      phone: String(phone),
    };

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: `${FRONTEND_URL}/success`,
      cancel_url: `${FRONTEND_URL}/cancel`,
      metadata,
    });

    return res.json({ checkoutUrl: session.url, method: "payment", orderId });
  } catch (err) {
    console.error(err);
    next(err)
  }
};

const CreateCheckoutCOD = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.body;
    const order = await Order.findOne({
      where: {
        id: orderId,
      },
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
            },
          ],
        },
      ],
    });
    if (!order) {
      return res.status(404).json({
        message: "Not Found",
      });
    }

    const line_items = order.items.map((ci) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: ci.product.productName,
        },
        unit_amount: Math.round(ci.product.price * 100),
      },
      quantity: ci.quantity,
    }));

    const metadata = {
      userId: String(userId),
      orderId,
    };
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: `${FRONTEND_URL}/success?orderId=${order.id}`,
      cancel_url: `${FRONTEND_URL}/cancel`,
      metadata,
    });

    return res.json({ checkoutUrl: session.url });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

const HandleSuccessTransaction = async (req, res, next) => {
  try {
    const sig = req.headers["stripe-signature"];

    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type !== "checkout.session.completed") {
      return res.json({ received: true });
    }

    const session = event.data.object;

    if (session.payment_status !== "paid") {
      return res.json({ received: true });
    }

    const orderId = session.metadata.orderId;

    if (orderId) {
    
      const order = await Order.findOne({
        where: {
          id: orderId,
        },
      });

      if (!order) {
        return res.status(404).json({
          message: "Not Found",
        });
      }

      await order.update({
        payment_status: "paid",
        session_id:session.id
      });
      return res.status(200).json({
        message: "Successfully",
      });
    }
    const userId = Number(session.metadata.userId);
    const breakdown = JSON.parse(session.metadata.businessBreakdown);
    const address = session.metadata.address;
    const phone = session.metadata.phone;

    for (const item of breakdown) {
      const businessId = Number(item.businessId);
      const productIds = item.productIds;

      const existedOrder = await Order.findOne({
        where: {
          session_id: session.id,
        },
      });
      if (existedOrder) continue;

      const cartItems = await CartItem.findAll({
        where: {
          user_id: userId,
          product_id: { [Op.in]: productIds },
        },
        include: [{ model: Product, as: "product" }],
      });

      if (!cartItems.length) continue;

      let totalAmount = 0;
      cartItems.forEach(
        (ci) => (totalAmount += ci.product.price * ci.quantity)
      );

      const order = await Order.create({
        user_id: userId,
        business_id: businessId,
        total_amount: totalAmount,
        payment_status: "paid",
        session_id: session.id,
        payout_status: "pending",
        address: address,
        phone_number: phone,
      });

      for (const ci of cartItems) {
        await OrderItem.create({
          order_id: order.id,
          product_id: ci.product_id,
          quantity: ci.quantity,
          price: ci.product.price,
        });
      }

      const platformFee = Math.round(totalAmount * 0.1);
      const sellerAmount = totalAmount - platformFee;
      if (sellerAmount <= 0) continue;

      const seller = await Business.findByPk(businessId);
      if (!seller?.bank_account_Id) continue;
    }

    await CartItem.destroy({ where: { user_id: userId } });

    res.json({ received: true });
  } catch (err) {
    console.error("WEBHOOK ERROR:", err.message);
    next(err)
  }
};

module.exports = {
  CreateCheckoutController,
  HandleSuccessTransaction,
  CreateCheckoutCOD,
};
