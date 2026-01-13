"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Posts", "shared_post_id", {
      type: Sequelize.INTEGER,
      allowNull: true, // cho phép NULL
      references: {
        model: "Posts", // bảng tham chiếu chính nó
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL", // khi bài gốc bị xóa thì set null
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
