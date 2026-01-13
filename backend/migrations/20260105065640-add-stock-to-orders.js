'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Thêm cột stock vào bảng Orders
    await queryInterface.addColumn('Orders', 'stock', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    });
  },

  async down(queryInterface, Sequelize) {
    // Xóa cột stock khi rollback
    await queryInterface.removeColumn('Orders', 'stock');
  }
};
