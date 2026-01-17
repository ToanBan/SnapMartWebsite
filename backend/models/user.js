"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Post, {
        foreignKey: "userId",
        as: "posts",
      });

      User.hasMany(models.PostReaction, { foreignKey: "userId" });
      User.hasMany(models.Comment, { foreignKey: "userId", as: "comments" });
      User.hasMany(models.Follow, {
        foreignKey: "followingId",
        as: "followers",
      });

      // Followings (những người mà user này theo dõi)
      User.hasMany(models.Follow, {
        foreignKey: "followerId",
        as: "followings",
      });
      User.hasOne(models.Business, {
        foreignKey: "userId",
        as: "business",
      });
      User.hasMany(models.CartItem, { foreignKey: "user_id", as: "cartItems" });
      User.hasMany(models.Order, { foreignKey: "user_id", as: "orders" });
      User.hasMany(models.Notification, {
        foreignKey: "sender_id",
        as: "sentNotifications",
      });

      User.hasMany(models.Notification, {
        foreignKey: "receiver_id",
        as: "receivedNotifications",
      });
    }
  }
  User.init(
    {
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      status: {
        type: DataTypes.ENUM("active", "blocked"),
        allowNull: false,
        defaultValue: "active",
      },

      is_verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      avatar: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      role: {
        type: DataTypes.ENUM("user", "business", "admin"),
        allowNull: false,
        defaultValue: "user",
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );

  return User;
};
