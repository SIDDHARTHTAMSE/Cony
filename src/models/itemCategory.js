const { DataTypes } = require('sequelize');
const { sequelize } = require('./db');

const ItemCategory = sequelize.define('ItemCategory', {
  category_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  category_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, { timestamps: true });

module.exports = ItemCategory;
