'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Comment.belongsTo(models.User, {
        foreignKey: 'userId',
      })
      Comment.belongsTo(models.UserInfo, {
        foreignKey: 'userId',
      })
      Comment.belongsTo(models.Review, {
        foreignKey: 'reviewId',
      })
      Comment.hasMany(models.Like, {
				foreignKey: 'likeableId',
				constraints: false,
				scope: {
					likeableType: 'comment'
				}
			});
    }
  }
  Comment.init({
    userId: DataTypes.INTEGER,
    reviewId: DataTypes.INTEGER,
    content: DataTypes.TEXT,
    deletedAt: DataTypes.DATE,
  }, {
    sequelize,
    tableName: 'comments',
    modelName: 'Comment',
    paranoid: true
  });
  return Comment;
};