'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Posts', 'type', {
      type: Sequelize.ENUM('image', 'video', 'none'),
      allowNull: true, // hoặc false tùy nhu cầu
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Posts', 'type', {
      type: Sequelize.ENUM('image', 'video'),
      allowNull: true, // hoặc false
    });
  }
};
