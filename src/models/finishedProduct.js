const { DataTypes } = require('sequelize');
const { sequelize } = require('./db');

const FinishedProduct = sequelize.define('FinishedProduct', {
  finished_product_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  manufactured_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  manufactured_quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, { timestamps: true });

module.exports = FinishedProduct;
