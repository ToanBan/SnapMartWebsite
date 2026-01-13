'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      Comment.belongsTo(models.User, { foreignKey: 'userId' });
      Comment.belongsTo(models.Post, { foreignKey: 'postId' });
      Comment.belongsTo(models.Comment, { as: 'parent', foreignKey: 'parentId' });
      Comment.hasMany(models.Comment, { as: 'replies', foreignKey: 'parentId' });
    }
  }

  Comment.init(
    {
      userId: DataTypes.INTEGER,
      postId: DataTypes.INTEGER,
      parentId: DataTypes.INTEGER,
      content: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: 'Comment',
    }
  );
  return Comment;
};
