const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Product = require('../models/products');

const FinishedProduct = sequelize.define('FinishedProduct', {
  finished_product_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
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

// // Associations
// FinishedComponent.belongsTo(Component, { foreignKey: 'component_id' });
// Component.hasMany(FinishedComponent, { foreignKey: 'component_id' });

module.exports = FinishedProduct;
