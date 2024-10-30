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
}, { tableName: 'finished_products' });

// Associations
FinishedProduct.belongsTo(Product, { foreignKey: 'product_id' });
Product.hasMany(FinishedProduct, { foreignKey: 'product_id' });

module.exports = FinishedProduct;
