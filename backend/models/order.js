"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Order.hasMany(models.OrderItem, {
        foreignKey: "order_id",
        as: "items",
      });

      Order.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });
    }
  }
  Order.init(
    {
      user_id: DataTypes.INTEGER,
      total_amount: DataTypes.INTEGER,
      payment_status: DataTypes.STRING,
      session_id: DataTypes.STRING,
      address: DataTypes.STRING,
      phone_number: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      payout_status: {
        type: DataTypes.ENUM("pending", "paid", "failed"),
        allowNull: false,
        defaultValue: "pending",
      },

      status: {
        type: DataTypes.ENUM("pending", "approval", "shipping", "delivered"),
        allowNull: false,
        defaultValue: "pending",
      },
    },
    {
      sequelize,
      modelName: "Order",
    }
  );
  return Order;
};
