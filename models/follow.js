'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class follow extends Model {
    static associate(models) {
      follow.belongsTo(models.user, { foreignKey: 'userFollowerId', as: 'follower' });
      follow.belongsTo(models.user, { foreignKey: 'userFollowedId', as: 'followed' });
    }
  }
  follow.init({
    userFollowerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'userId'
      }
    },
    userFollowedId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'userId'
      }
    }
  }, {
    sequelize,
    modelName: 'follow',
    tableName: 'follows'
  });
  return follow;
};