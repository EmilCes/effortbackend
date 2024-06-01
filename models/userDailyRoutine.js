'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class userDailyRoutine extends Model {
    static associate(models) {}
  }
  
  userDailyRoutine.init({
    userId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'users',
          key: 'userId'
        }
      },
      routineId: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.INTEGER,
        references: {
          model: 'dailyroutines',
          key: 'routineId'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      creator: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
  }, {
    sequelize,
    freezeTableName: true,
    modelName: 'userDailyRoutine',
    tableName: 'userDailyRoutines',
    timestamps: true
  });

  return userDailyRoutine;
};
