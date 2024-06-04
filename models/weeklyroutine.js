'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class weeklyroutine extends Model {
    static associate(models) {
      weeklyroutine.hasMany(models.weeklydailyroutine, { foreignKey: 'weeklyroutineId'});
      weeklyroutine.belongsTo(models.user, { foreignKey: 'userId', as: 'user' });
    }
  }
  weeklyroutine.init({
    weeklyroutineId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    name: {
      type: DataTypes.STRING,
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
    }
  }, {
    sequelize,
    modelName: 'weeklyroutine',
    tableName: 'weeklyroutines'
  });

  return weeklyroutine;
};