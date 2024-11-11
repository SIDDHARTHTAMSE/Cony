const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Component = require('../models/component');

const FinishedComponent = sequelize.define('FinishedComponent', {
  finished_component_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  component_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Component,
      key: 'component_id',
    },
  },
  manufactured_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  manufactured_quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, { tableName: 'finished_components' });

// // Associations
// FinishedComponent.belongsTo(Component, { foreignKey: 'component_id' });
// Component.hasMany(FinishedComponent, { foreignKey: 'component_id' });

module.exports = FinishedComponent;
