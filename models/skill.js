'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Skill extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Skill.belongsTo(models.User, {
        onDelete: "CASCADE",
        foreignKey: {
          allowNull: true}
        })
        models.Skill.belongsTo(models.TechStack, {
          onDelete: "CASCADE",
          foreignKey: {
            allowNull: true}
          })
    }
  };
  Skill.init({
  }, {
    sequelize,
    modelName: 'Skill',
  });
  return Skill;
};