"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Messages", "fileName", {
      type: Sequelize.STRING,
      allowNull: true, 
      after: "content", 
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Messages", "fileName");
  },
};
