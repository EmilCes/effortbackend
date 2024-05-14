'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class userType extends Model {
    static associate(models) {
      userType.hasMany(models.user, { foreignKey: 'userTypeId' })
    }
  }
  userType.init({
    userTypeId: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    freezeTableName: true,
    modelName: 'userType',
    tableName: 'userTypes'
  });

  return userType;
};