"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ErrorLog extends Model {
    static associate(models) {
      // define association here
    }
  }
  ErrorLog.init(
    {
      message: DataTypes.TEXT,
      stack: DataTypes.TEXT,
      url: DataTypes.STRING,
      method: DataTypes.STRING,
      statusCode: DataTypes.INTEGER,
      userId: DataTypes.BIGINT,
      payload: DataTypes.JSON,
    },
    {
      sequelize,
      modelName: "ErrorLog",
    }
  );
  return ErrorLog;
};
