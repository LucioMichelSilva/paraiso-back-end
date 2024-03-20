const { DataTypes, Model } = require('sequelize');
const sequelize = require('../database');

class Service extends Model {}

Service.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  },
}, {
  sequelize,
  modelName: 'Service'
});

module.exports = Service;
