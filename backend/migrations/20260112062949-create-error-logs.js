"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ErrorLogs", {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },

      message: {
        type: Sequelize.TEXT,
        allowNull: false,
      },

      stack: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      url: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      method: {
        type: Sequelize.STRING(10),
        allowNull: true,
      },

      statusCode: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },

      userId: {
        type: Sequelize.BIGINT,
        allowNull: true,
      },

      payload: {
        type: Sequelize.JSON,
        allowNull: true,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("ErrorLogs");
  },
};
