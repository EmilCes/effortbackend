'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    static associate(models) {
      user.belongsTo(models.userType, { foreignKey: 'userTypeId' });
    }
  }
  user.init({
    userId: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    middlename: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: ""
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    weight: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0.0
    },
    height: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 100
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: "1999-09-09"
    },
    bio: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "Entrenando..."
    },
    streak: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    userTypeId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    emailVerificationToken: {
      type: DataTypes.STRING,
      defaultValue: null
    }
  }, {
    sequelize,
    freezeTableName: true,
    modelName: 'user',
    tableName: 'users'
  });

  return user;
};