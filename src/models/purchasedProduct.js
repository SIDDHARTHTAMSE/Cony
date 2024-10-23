const { DataTypes } = require('sequelize');
const { sequelize } = require('./db');

const PurchasedProduct = sequelize.define('PurchasedProduct', {
  purchase_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  purchase_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  purchased_quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, { timestamps: true });

module.exports = PurchasedProduct;
