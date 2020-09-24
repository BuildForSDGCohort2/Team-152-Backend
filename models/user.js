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
    }
  };
  User.init({
    name: DataTypes.STRING,
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    gender: DataTypes.STRING,
    location: DataTypes.INTEGER,
    jobRole: DataTypes.STRING,
    skill: DataTypes.INTEGER,
    technologyYouCanTeach: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};