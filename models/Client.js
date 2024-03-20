const { DataTypes, Model } = require('sequelize');
const sequelize = require('../database');

class Client extends Model {}

Client.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
}, {
  sequelize,
  modelName: 'Client'
});

module.exports = Client;
