const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Product = require('./Product');

const FinishedProduct = sequelize.define('FinishedProduct', {
  finished_product_id: {
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
  manufactured_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  manufactured_quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  available_quantity: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, { tableName: 'finished_products' });

module.exports = FinishedProduct;
