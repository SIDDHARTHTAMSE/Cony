const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Category = require('../models/category');

const Component = sequelize.define('Component', {
  component_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  component_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  category_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Category,
      key: 'category_id',
    },
  },
}, { tableName: 'components' });

module.exports = Component;
