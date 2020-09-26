'use strict';
const bcrypt = require('bcrypt')
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
      models.User.hasMany(models.TechnologyYouCanTeach)
      models.User.hasMany(models.Skill)
    }
  };
  User.init({
    name: DataTypes.STRING,
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    gender: DataTypes.STRING,
    location: DataTypes.STRING,
    jobRole: DataTypes.STRING,
    skill: DataTypes.INTEGER,
    technologyYouCanTeach: DataTypes.INTEGER,
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    paranoid: true, instanceMethods: {
      comparePasswords: (password, prevPassword,callback) => {
        bcrypt.compare(password, prevPassword, (error, isMatch) => {
            if(error) {
                return callback(error);
            }
    
            return callback(null, isMatch);
        });
    }
  },
  hooks: {
      beforeValidate: (user) => {
        if(user.changed('password')) {
            return bcrypt.hash(user.password, 10).then(function(password) {
                user.password = password;
            });
        }
    }
  }
  });
  return User;
};