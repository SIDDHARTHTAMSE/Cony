const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Vendor = sequelize.define('Vendor',  {
    vendor_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    vendor_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    country: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    contact_details: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    email_id: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
    },
}, {
    tableName: 'vendor',
});

module.exports = Vendor;