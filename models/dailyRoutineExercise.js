'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class dailyRoutineExercise extends Model {
    static associate(models) {}
  }
  
  dailyRoutineExercise.init({
    routineId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'dailyroutines',
        key: 'routineId'
      }
    },
    exerciseId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'exercises',
        key: 'exerciseId'
      }
    },
    series: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    repetitions: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    freezeTableName: true,
    modelName: 'dailyRoutineExercise',
    tableName: 'dailyRoutineExercises',
    timestamps: true
  });

  return dailyRoutineExercise;
};
