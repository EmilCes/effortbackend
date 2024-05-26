'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class muscle extends Model {

    static associate(models) {
      muscle.belongsToMany(models.exercise, { as: 'exercises', through: 'exercisesMuscles', foreignKey: 'muscleId' })
    }
  }
  muscle.init({
    muscleId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    muscleName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    sequelize,
    freezeTableName: true,
    modelName: 'muscle',
    tableName: 'muscles'
  });
  return muscle;
};