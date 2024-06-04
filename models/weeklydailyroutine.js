'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class weeklydailyroutine extends Model {
    static associate(models) {
      weeklydailyroutine.belongsTo(models.weeklyroutine, { foreignKey: 'weeklyroutineId' });
      weeklydailyroutine.belongsTo(models.dailyroutine, { foreignKey: 'routineId' });
    }
  }
  weeklydailyroutine.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    weeklyroutineId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    routineId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    day: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'weeklydailyroutine',
    tableName: 'weeklydailyroutines'
  });
  return weeklydailyroutine;
};