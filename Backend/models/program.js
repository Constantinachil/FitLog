const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Program = sequelize.define('Program', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  createdBy: { // Trainer/Admin who created it
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'Programs',
  timestamps: true
});

module.exports = Program;
