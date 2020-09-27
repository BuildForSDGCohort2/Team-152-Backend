'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TechStack extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      
        
    }
  };
  TechStack.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'TechStack',
  });
  return TechStack;
};