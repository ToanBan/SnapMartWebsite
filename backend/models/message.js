"use strict";
const { Model, ENUM } = require("sequelize");
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
      type: {
        type: DataTypes.ENUM("text", "file"),
        allowNull: false,
        defaultValue: "text",
      },
      fileName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Message",
    }
  );
  return Message;
};
