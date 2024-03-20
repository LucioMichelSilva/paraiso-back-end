const { DataTypes, Model } = require('sequelize');
const sequelize = require('../database');
const Service = require('./Service');
const Client = require('./Client');

class Image extends Model {}

Image.init({
  data: {
    type: DataTypes.BLOB,
    allowNull: false
  },
  clientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Clients', // Nome da tabela no banco de dados
      key: 'id',
    }
  },
  serviceId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Services', // Nome da tabela no banco de dados
      key: 'id',
    }
  }
}, {
  sequelize,
  modelName: 'Image'
});

Image.belongsTo(Service, {foreignKey: 'serviceId'});
Image.belongsTo(Client, {foreignKey: 'clientId'});

module.exports = Image;
