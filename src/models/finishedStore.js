const { DataTypes } = require('sequelize');
const sequelize = require('../db'); // Import your DB instance
const Product = require('./Product'); 

const FinishedStore = sequelize.define(
  'FinishedStore',
  {
    finished_store_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, // Optional auto-increment ID
      allowNull: false,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Product,
        key: 'product_id',
      },
    },
    available_quantity: {
      type: DataTypes.INTEGER,
      allowNull: false, // Mandatory field
    },
  },
  {
    tableName: 'finished_store'
  }
);

module.exports = FinishedStore;
