'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
     getLikeable(options) {
			if (!this.likeableType) return Promise.resolve(null);
			const mixinMethodName = `get${uppercaseFirst(this.likeableType)}`;
			return this[mixinMethodName](options);
		}
    static associate(models) {
      // define association here
      Like.belongsTo(models.Review, {
        foreignKey: 'likeableId',
        constraints: false, 
      })
      Like.belongsTo(models.Comment, {
        foreignKey: 'likeableId',
        constraints: false, 
      })
      Like.belongsTo(models.User, {
				foreignKey: 'userId',
				constraints: false,
			});
    }
  }
  Like.init({
    likeableId: DataTypes.INTEGER,
    likeableType: DataTypes.STRING,
    deletedAt: DataTypes.DATE
  }, {
    sequelize,
    tableName: 'likes',
    modelName: 'Like',
    paranoid: true
  });
  Like.addHook("afterFind", findResult => {
		if (!Array.isArray(findResult)) findResult = [findResult];
		for (const instance of findResult) {
			if (instance?.likeableType === "review" && instance.Review !== undefined) {
				instance.likeable = instance.Review;
			} else if (instance?.likeableType === "comment" && instance.comment !== undefined) {
				instance.likeable = instance.comment;
			}
			// To prevent mistakes:
			delete instance?.Review;
			delete instance?.dataValues.Review;
			delete instance?.comment;
			delete instance?.dataValues.comment;
		}
	});
  return Like;
};