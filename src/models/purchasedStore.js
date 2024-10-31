const { DataTypes } = require('sequelize');
const sequelize = require('../db'); 
const Product = require('./Product');

const PurchaseStore = sequelize.define(
  'PurchaseStore',
  {
    purchase_store_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, 
      allowNull: false, 
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Product,
        key: 'product_id',
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
// FinishedStore.belongsTo(FinishedProduct, { foreignKey: 'finished_product_id' });
// FinishedProduct.hasOne(FinishedStore, { foreignKey: 'finished_product_id' });
// PurchaseStore.belongsTo(FinishedStore, { foreignKey: 'finished_store_id' }); // Example association, if needed
// FinishedStore.hasMany(PurchaseStore, { foreignKey: 'finished_store_id' }); // Example association, if needed

module.exports = PurchaseStore;
