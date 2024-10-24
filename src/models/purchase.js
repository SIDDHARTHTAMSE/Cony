const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Product = require('./Product');

const Purchase = sequelize.define('Purchase', {
  purchase_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  product_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Product,
      key: 'product_id',
    },
  },
  purchase_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  purchased_quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  available_quantity: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, { tableName: 'purchases' });

module.exports = Purchase;
