"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Posts", "status", {
      type: Sequelize.ENUM("active", "hidden"),
      allowNull: false,
      defaultValue: "active",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Posts", "status");

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_Posts_status";'
    );
  },
};
