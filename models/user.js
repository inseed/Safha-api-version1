'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsTo(models.UserType, {
        foreignKey: 'userTypeId',
      })
      User.hasMany(models.Comment, {
        foreignKey: 'userId',
      })
      User.hasMany(models.Review, {
        foreignKey: 'userId',
      })
      User.hasOne(models.UserInfo, {
        foreignKey: 'userId',
      })
      User.belongsToMany(models.Book, {
        as:"FavoriteBooks",
        foreignKey: 'userId',
        through: 'favorites'
      })
      User.hasMany(models.Like, {
        foreignKey: 'userId',
      })
      User.hasMany(models.Rate, {
        foreignKey: 'userId'
      })
      User.hasMany(models.Book, {
        foreignKey: 'userId',  as:"AddedBooks"
      })
    }
  }
  User.init({
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    userTypeId: DataTypes.INTEGER,
    deletedAt: DataTypes.DATE
  }, {
    sequelize,
    tableName: 'users',
    modelName: 'User',
    paranoid: true
  });
  return User;
};