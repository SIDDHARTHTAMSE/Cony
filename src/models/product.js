const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Category = require('./Category');

const Product = sequelize.define('Product', {
  product_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  product_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Category,
      key: 'category_id',
    },
  },
}, { tableName: 'products' });

module.exports = Product;
