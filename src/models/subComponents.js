const{ DataTypes } = require('sequelize');
const sequelize = require('../db');
const Component =  require('../models/component');

const SubComponents = sequelize.define('SubComponents', {
    subcomponents_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    subcomponents_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    component_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Component,
            key: 'component_id',
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
    tableName: 'subcomponents',
    timestamps: true,
    freezeTableName: true,
});

module.exports = SubComponents;