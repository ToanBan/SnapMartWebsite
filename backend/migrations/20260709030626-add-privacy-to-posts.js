"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Posts", "privacy", {
      type: Sequelize.ENUM("public", "friends"),
      allowNull: false,
      defaultValue: "public",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Posts", "privacy");
  },
};
