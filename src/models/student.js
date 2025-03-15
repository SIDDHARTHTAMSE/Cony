const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Student = sequelize.define('Student', {
    student_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    student_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: false
    },
    roll_no: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
}, {
    tableName: 'student',
    }
);

module.exports = Student;