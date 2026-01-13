'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CartItem extends Model {
    static associate(models) {
      // Mỗi cartItem thuộc về 1 user
      CartItem.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });

      // Mỗi cartItem thuộc về 1 product
      CartItem.belongsTo(models.Product, { foreignKey: 'product_id', as: 'product' });
    }
  }

  CartItem.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'CartItem',
      tableName: 'cart_items',
      underscored: true,
    }
  );

  return CartItem;
};
