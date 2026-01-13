"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Messages", "senderType", {
      type: Sequelize.ENUM("user", "business"),
      allowNull: false,
      defaultValue: "user",
    });

    await queryInterface.addColumn("Messages", "receiverType", {
      type: Sequelize.ENUM("user", "business"),
      allowNull: false,
      defaultValue: "user",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Messages", "senderType");
    await queryInterface.removeColumn("Messages", "receiverType");
  },
};
