'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Publisher extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Publisher.hasMany(models.Book, {
        foreignKey: 'publisherId',
      })
    }
  }
  Publisher.init({
    name: DataTypes.STRING,
    des: DataTypes.TEXT,
    // bookId: DataTypes.INTEGER,
    deletedAt: DataTypes.DATE,
  }, {
    sequelize,
    tableName: 'publishers',
    modelName: 'Publisher',
    paranoid: true
  });
  return Publisher;
};