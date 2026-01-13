const jwt = require("jsonwebtoken");
const { OrderItem, Order, Product, Sequelize, User } = require("../models");

const GetOrderByUser = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const orders = await Order.findAll({
      where: {
        user_id: userId,
      },
      attributes: {
        include: [
          [Sequelize.fn("COUNT", Sequelize.col("items.id")), "itemCount"],
        ],
      },
      include: [
        {
          model: OrderItem,
          as: "items",
          attributes: [],
        },
      ],
      group: ["Order.id"],
    });

    return res.status(200).json({
      message: orders,
    });
  } catch (error) {
    next(error)
  }
};

const GetOrderDetailByUser = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const order = await Order.findOne({
      where: {
        id,
        user_id: userId,
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
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "email"],
        },
      ],
    });

    return res.status(200).json({
      message: order,
    });
  } catch (error) {
    next(error)
  }
};

const ReceiveOrderByUser = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.body;
    const order = await Order.findOne({
      where: {
        id: orderId,
        user_id: userId,
      },
    });

    if (!order) {
      return res.status(404).json({
        message: "Not Found",
      });
    }
    await order.update({
      status: "delivered",
    });

    return res.status(200).json({
      success: true,
      message: order,
    });
  } catch (error) {
    console.error(error);
    next(error)
  }
};

module.exports = {
  GetOrderByUser,
  GetOrderDetailByUser,
  ReceiveOrderByUser
};
