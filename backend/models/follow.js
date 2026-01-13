"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Follow extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Follow.belongsTo(models.User, {
        foreignKey: "followerId",
        as: "follower",
      });

      Follow.belongsTo(models.User, {
        foreignKey: "followingId",
        as: "following",
      });

      Follow.hasOne(models.Follow, {
        foreignKey: "followerId",
        sourceKey: "followingId",
        as: "friends",
      });
    }
  }
  Follow.init(
    {
      followerId: DataTypes.INTEGER,
      followingId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Follow",
    }
  );
  return Follow;
};
