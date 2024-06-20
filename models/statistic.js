'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class statistic extends Model {
    static associate(models) {
      statistic.belongsTo(models.user, { foreignKey: 'userId', as: 'user' });
    }
  }
  
  statistic.init({
    day: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    time: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'userId'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
  }, {
    sequelize,
    modelName: 'statistic', 
    tableName: 'statistics'
  });

  return statistic;
};
