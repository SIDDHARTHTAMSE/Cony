const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Product = require('../models/products');

const OrderConfig = sequelize.define('OrderConfig', {
    order_config_id: {
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
    order_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    is_confirmed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    is_priority: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
}, { tableName: 'order_config'});

module.exports = OrderConfig;