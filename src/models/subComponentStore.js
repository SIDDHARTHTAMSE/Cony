const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const SubComponent = require('../models/subComponents');

const SubComponentStore = sequelize.define('SubComponentStore', {
    subcomponentstore_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    subcomponents_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: SubComponent,
            key: 'subcomponents_id',
        },
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
}, {
    tableName: 'subcomponentstore'
});

module.exports = SubComponentStore;