"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Orders", "payout_status", {
      type: Sequelize.ENUM("pending", "paid", "failed"),
      allowNull: false,
      defaultValue: "pending",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Orders", "payout_status");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_Orders_payout_status";'
    );
  },
};
