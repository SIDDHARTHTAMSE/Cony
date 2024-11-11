const { DataTypes } = require('sequelize');
const sequelize = require('../db'); 
const Component = require('../models/component');

const PurchaseStore = sequelize.define(
  'PurchaseStore',
  {
    purchase_store_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, 
      allowNull: false, 
    },
    component_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Component,
        key: 'component_id',
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

// // Define associations **after** the model definitions
// FinishedStore.belongsTo(FinishedComponent, { foreignKey: 'finished_component_id' });
// FinishedComponent.hasOne(FinishedStore, { foreignKey: 'finished_component_id' });
// PurchaseStore.belongsTo(FinishedStore, { foreignKey: 'finished_store_id' }); // Example association, if needed
// FinishedStore.hasMany(PurchaseStore, { foreignKey: 'finished_store_id' }); // Example association, if needed

module.exports = PurchaseStore;
