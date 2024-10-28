const { DataTypes } = require('sequelize');
const sequelize = require('../db'); // Import your DB instance
const FinishedProduct = require('./FinishedProduct'); // Import FinishedProduct model

const FinishedStore = sequelize.define(
  'FinishedStore',
  {
    finished_store_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, // Optional auto-increment ID
      allowNull: false,
    },
    finished_product_id: {
      type: DataTypes.INTEGER,
      allowNull: false, // Mandatory FK
      references: {
        model: FinishedProduct,
        key: 'finished_product_id',
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
