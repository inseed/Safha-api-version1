'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserInfo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserInfo.belongsTo(models.User, {
        foreignKey: 'userId',
      })
      UserInfo.hasMany(models.Comment, {
        foreignKey: 'userId',
      })
      UserInfo.hasMany(models.Review, {
        foreignKey: 'userId',
      })
    }
  }
  UserInfo.init({
    // userId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    nickname: DataTypes.STRING,
    des: DataTypes.STRING,
    avatar: DataTypes.STRING,
    bgPic: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'userInfos',
    modelName: 'UserInfo',
  });
  return UserInfo;
};