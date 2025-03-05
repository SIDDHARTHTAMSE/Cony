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
    allowNull: true, 
    references: {
      model: Category,
      key: 'category_id',
    },
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  },
  is_deleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, { 
  tableName: 'components',
  paranoid: false,
  timestamps: true,
 }
);

module.exports = Component;
