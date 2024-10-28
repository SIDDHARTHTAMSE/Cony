const { DataTypes } = require('sequelize');
const sequelize = require('../db'); 
const Purchase = require('./purchase'); 

const PurchaseStore = sequelize.define(
  'PurchaseStore',
  {
    purchase_store_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, 
      allowNull: false, 
    },
    purchase_id: {
      type: DataTypes.INTEGER,
      allowNull: false, 
      references: {
        model: Purchase,
        key: 'purchase_id',
      },
    },
    available_quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: 'purchase_store'
  }
);

module.exports = PurchaseStore;
