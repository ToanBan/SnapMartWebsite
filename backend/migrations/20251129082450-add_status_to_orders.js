'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Orders', 'status', {
      type: Sequelize.ENUM('pending', 'approval', 'shipping', 'delivered'),
      allowNull: false,
      defaultValue: 'pending',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Orders', 'status');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Orders_status";');
  }
};
