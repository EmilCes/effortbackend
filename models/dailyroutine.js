'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class dailyroutine extends Model {
    static associate(models) {
      dailyroutine.belongsToMany(models.weeklyroutine, { through: models.weeklydailyroutine, foreignKey: 'dailyroutineId'});
    }
  }
  dailyroutine.init({
    routineId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'dailyroutine',
    tableName: 'dailyroutines'
  });
  return dailyroutine;
};