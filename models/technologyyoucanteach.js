'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TechnologyYouCanTeach extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.TechnologyYouCanTeach.belongsTo(models.User, {
        onDelete: "CASCADE",
        foreignKey: {
          allowNull: true}
        })
        models.TechnologyYouCanTeach.belongsTo(models.TechStack, {
          onDelete: "CASCADE",
          foreignKey: {
            allowNull: true}
          })
    }
  };
  TechnologyYouCanTeach.init({
  }, {
    sequelize,
    modelName: 'TechnologyYouCanTeach',
  });
  return TechnologyYouCanTeach;
};