// models/achievement.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Achievement = sequelize.define('Achievement', {
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  type: { type: DataTypes.STRING, allowNull: false }, 
  threshold: { type: DataTypes.INTEGER, allowNull: false }
}, {
  tableName: 'Achievements',
  timestamps: true
});

module.exports = Achievement;
