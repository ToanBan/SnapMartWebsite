"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.belongsTo(models.Business, {
        foreignKey: "businessId",
        as: "business",
      });
      Product.hasMany(models.CartItem, {
        foreignKey: "product_id",
        as: "cartItems",
      });

      Product.hasMany(models.OrderItem, {
        foreignKey:"product_id", 
        as:"orderItems"
      })
    }
  }
  Product.init(
    {
      businessId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      productName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      description: DataTypes.TEXT,
      image: DataTypes.STRING,
      status: {
        type: DataTypes.ENUM("pending", "approved", "rejected"),
        defaultValue: "pending",
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
    },
    {
      sequelize,
      modelName: "Product",
    }
  );
  return Product;
};
