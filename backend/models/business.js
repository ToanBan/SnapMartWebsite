"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Business extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Business.belongsTo(models.User, { foreignKey: "userId", as: "user" });
      Business.hasMany(models.Product, {
        foreignKey: "businessId",
        as: "products",
      });
    }
  }
  Business.init(
  {
    userId: DataTypes.INTEGER,
    businessName: DataTypes.STRING,
    taxCode: DataTypes.STRING,
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    address: DataTypes.STRING,
    description: DataTypes.TEXT,
    logo: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM("pending", "approved", "rejected"),
      defaultValue: "pending",
    },
    verificationDocument: DataTypes.STRING,
    
    // Thêm 2 trường mới
    bankName: DataTypes.STRING,
    bankNumber: DataTypes.STRING,
    bank_account_Id:DataTypes.STRING
  },
  {
    sequelize,
    modelName: "Business",
  }
);

  return Business;
};
