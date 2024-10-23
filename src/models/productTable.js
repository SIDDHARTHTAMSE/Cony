const { DataTypes } = require('sequelize');
const { sequelize } = require('./db'); // Importing sequelize instance

const Product = sequelize.define('Product', {
  product_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  category_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'ItemCategories', key: 'category_id' },
  },
  product_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, { timestamps: true });

module.exports = Product;
