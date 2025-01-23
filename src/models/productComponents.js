const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Product = require('../models/products');
const Component = require('../models/component');

const ProductComponents = sequelize.define('ProductComponents', {
    product_component_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Product,
            key: 'product_id',
        },
    },
    component_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: false,
        references: {
            model: Component,
            key: 'component_id',
        },
    },
    quantity: {
        type: DataTypes.INTEGER,
    },
}, { tableName: 'product_component' });

module.exports = ProductComponents;