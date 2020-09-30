'use strict';

const bcrypt = require('bcrypt')
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    gender: DataTypes.STRING,
    location: DataTypes.STRING,
    jobRole: DataTypes.STRING,
    skill: DataTypes.INTEGER,
    technologyYouCanTeach: DataTypes.INTEGER,
    password: DataTypes.STRING
    
  }, { paranoid: true, instanceMethods: {
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
}});
  User.associate = (models) => {
    // associations can be defined here
    models.User.hasMany(models.TechnologyYouCanTeach)
    models.User.hasMany(models.Skill)
  };
  return User;
};