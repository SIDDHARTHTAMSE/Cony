const { DataTypes } = require('sequelize');
const { sequelize } = require('./db');

const Store = sequelize.define('Store', {
  store_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  purchase_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'PurchasedProducts', key: 'purchase_id' },
  },
  finished_product_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'FinishedProducts', key: 'finished_product_id' },
  },
  product_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'Products', key: 'product_id' },
  },
  available_quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: true, // Optional field
  },
}, { timestamps: true });

module.exports = Store;
