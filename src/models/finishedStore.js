const { DataTypes } = require('sequelize');
const sequelize = require('../db'); 
const Product = require('../models/products'); 

const FinishedStore = sequelize.define(
  'FinishedStore',
  {
    finished_store_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
      allowNull: false,
      defaultValue: 0,
    },
    initial_available_quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: 'finished_store'
  }
);

module.exports = FinishedStore;
