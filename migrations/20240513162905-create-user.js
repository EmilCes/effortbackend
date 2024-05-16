'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      username: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      middlename: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: ""
      },
      lastname: {
        type: Sequelize.STRING,
        allowNull: false
      },
      weight: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0.0
      },
      height: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 100
      },
      dateOfBirth: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        defaultValue: "1999-09-9"

      },
      bio: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: "Entrenando..."
      },
      streak: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      userTypeId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'userTypes',
          key: 'userTypeId'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      emailVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      emailVerificationToken: {
        type: Sequelize.STRING,
        defaultValue: null
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};