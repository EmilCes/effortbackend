'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class exercise extends Model {

    static associate(models) {
      exercise.belongsToMany(models.muscle, { as: 'muscles', through: 'exercisesMuscles', foreignKey: 'exerciseId' })
      exercise.belongsToMany(models.dailyroutine, { as: 'dailyroutines', through: models.dailyRoutineExercise, foreignKey: 'exerciseId', otherKey: 'routineId' })
      exercise.belongsTo(models.user, { foreignKey: 'creatorId', as: 'creator' });
    }
  }
  exercise.init({
    exerciseId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    videoUrl: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isValid: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    creatorId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'users',
        key: 'userId'
      }
    }
  }, {
    sequelize,
    freezeTableName: true,
    modelName: 'exercise',
    tableName: 'exercises'
  });

  return exercise;
};