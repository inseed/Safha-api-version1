'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Book.hasMany(models.Review, {
        foreignKey: 'bookId',
      })
      Book.belongsTo(models.Category, {
        foreignKey: 'categoryId',
      })
      Book.belongsTo(models.Publisher, {
        foreignKey: 'publisherId', 
      })
      Book.belongsToMany(models.User, {
        as:"Favorite",
        foreignKey: 'bookId', 
        through: 'favorites'
      })
      // Book.belongsToMany(models.Category, {
      //   foreignKey: 'bookId',
      //   through: 'bookTypes'
      // })
      Book.hasMany(models.Rate, {
        foreignKey: 'bookId'
      })
      Book.belongsTo(models.User, {
        foreignKey: 'userId', as: "Creator"
      })
    }
  }
  Book.init({
    name: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    pagesCount: DataTypes.INTEGER,
    categoryId: DataTypes.INTEGER,
    des: DataTypes.TEXT,
    cover: DataTypes.STRING,
    publish: DataTypes.DATE,
    lang: DataTypes.STRING,
    deletedAt: DataTypes.DATE,
    publisherId: DataTypes.INTEGER,
    ISBN: DataTypes.STRING,
    author: DataTypes.STRING,
    kindle: DataTypes.BOOLEAN,
    paper: DataTypes.BOOLEAN,
  }, {
    sequelize,
    tableName: 'books',
    modelName: 'Book',
    paranoid: true
  });
  return Book;
};