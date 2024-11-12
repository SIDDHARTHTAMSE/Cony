const { DataTypes } = require('sequelize');
const sequelize = require('../db')

const Product = sequelize.define('Product', {
    product_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    product_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: {
                msg: 'Product name is required'
            }
        }
    },
}, { tableName: 'products'});

module.exports = Product;