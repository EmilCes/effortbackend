'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('weeklydailyroutines', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
      },
      weeklyroutineId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'weeklyroutines',
          key: 'weeklyroutineId'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      dailyroutineId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'dailyroutines',
          key: 'routineId'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      day: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('weeklydailyroutines');
  }
};