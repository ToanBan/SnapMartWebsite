"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "avatar", {
      type: Sequelize.STRING,
      allowNull: true, // cho phép null
    });

    await queryInterface.addColumn("Users", "description", {
      type: Sequelize.TEXT,
      allowNull: true, // cho phép null
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
