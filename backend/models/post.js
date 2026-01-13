"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate(models) {
      Post.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });

      Post.hasMany(models.PostReaction, { foreignKey: "postId" });
      Post.hasMany(models.Comment, { foreignKey: "postId", as: "comments" });

      Post.belongsTo(models.Post, {
        foreignKey: "shared_post_id",
        as: "sharedPost",
      });

      Post.hasMany(models.Post, {
        foreignKey: "shared_post_id",
        as: "sharedBy",
      });
    }
  }
  Post.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      post_url: DataTypes.STRING,
      post_caption: DataTypes.TEXT,
      status: {
        type: DataTypes.ENUM("active", "hidden"),
        allowNull: false,
        defaultValue: "active",
      },

      report_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      shared_post_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      type: {
        type: DataTypes.ENUM("image", "video", "none"),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Post",
    }
  );
  return Post;
};
