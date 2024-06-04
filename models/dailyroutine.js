'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class dailyroutine extends Model {
    static associate(models) {
      dailyroutine.hasMany(models.weeklydailyroutine, { foreignKey: 'routineId' });
      dailyroutine.belongsToMany(models.exercise, { as: 'exercises', through: models.dailyRoutineExercise, foreignKey: 'routineId', otherKey: 'exerciseId' })
      dailyroutine.belongsToMany(models.user, { through: models.userDailyRoutine, as: 'users', foreignKey: 'routineId' });
    }
  }
  dailyroutine.init({
    routineId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'dailyroutine',
    tableName: 'dailyroutines'
  });
  return dailyroutine;
};