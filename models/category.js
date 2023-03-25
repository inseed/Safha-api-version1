'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Category.hasMany(models.Book, {
        foreignKey: 'categoryId',
      })
      // Category.belongsToMany(models.Book, {
      //   foreignKey: 'categoryId',
      //   through: 'bookTypes'
      // })
    }
  }
  Category.init({
    name: DataTypes.STRING,
    des: DataTypes.TEXT,
    deletedAt: DataTypes.DATE,
  }, {
    sequelize,
    tableName: 'categories',
    modelName: 'Category',
    paranoid: true
  });
  return Category;
};