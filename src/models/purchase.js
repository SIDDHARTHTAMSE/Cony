// models/purchase.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Product = require('./product');

const Purchase = sequelize.define('Purchase', {
  purchase_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  purchase_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  purchased_quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  product_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Product,
      key: 'product_id',
    },
  },
});

Purchase.belongsTo(Product, { foreignKey: 'product_id' });

module.exports = Purchase;
