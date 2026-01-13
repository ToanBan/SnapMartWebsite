"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    static associate(models) {
      Message.belongsTo(models.User, { foreignKey: "senderId", as: "sender" });
      Message.belongsTo(models.User, {
        foreignKey: "receiverId",
        as: "receiver",
      });
    }
  }
  Message.init(
    {
      senderId: DataTypes.INTEGER,
      receiverId: DataTypes.INTEGER,
      senderType: {
        type: DataTypes.ENUM("user", "business"),
        allowNull: false,
        defaultValue: "user",
      },
      receiverType: {
        type: DataTypes.ENUM("user", "business"),
        allowNull: false,
        defaultValue: "user",
      },
      content: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Message",
    }
  );
  return Message;
};
