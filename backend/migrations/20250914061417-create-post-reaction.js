'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PostReactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE'
      },
      postId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Posts', key: 'id' },
        onDelete: 'CASCADE'
      },
      reactionType: {
        type: Sequelize.ENUM('like', 'love', 'haha', 'wow', 'sad', 'angry'),
        allowNull: false,
        defaultValue: 'like'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Ràng buộc: 1 user chỉ có 1 reaction trên 1 post
    await queryInterface.addConstraint('PostReactions', {
      fields: ['userId', 'postId'],
      type: 'unique',
      name: 'unique_user_post_reaction'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('PostReactions', 'unique_user_post_reaction');
    await queryInterface.dropTable('PostReactions');
  }
};
