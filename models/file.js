'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class file extends Model {
    static associate(models) {
    }
  }
  file.init({
    fileId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    mime: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    size: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    indb: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    data: {
        type: DataTypes.BLOB("long"),
        allowNull: true
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: true
    }
    
  }, {
    sequelize,
    freezeTableName: true,
    modelName: 'file',
    tableName: 'files'
  });
  
  return file;
};