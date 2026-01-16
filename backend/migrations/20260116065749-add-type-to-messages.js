"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Messages", "type", {
      type: Sequelize.ENUM("text", "file"),
      allowNull: false,
      defaultValue: "text",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Messages", "type");

    if (queryInterface.sequelize.options.dialect === "postgres") {
      await queryInterface.sequelize.query(
        'DROP TYPE IF EXISTS "enum_Messages_type";'
      );
    }
  },
};
