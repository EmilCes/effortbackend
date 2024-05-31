'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class weeklydailyroutine extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      weeklydailyroutine.belongsTo(models.dailyroutine, { foreignKey: 'dailyroutineId' });
    }
  }
  weeklydailyroutine.init({
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    weeklyroutineId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    dailyroutineId: {
      type: DataTypes.UUID,
      allowNull: false
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