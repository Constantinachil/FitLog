// models/ProgramExercise.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ProgramExercise = sequelize.define('ProgramExercise', {
  sets:     { type: DataTypes.INTEGER, allowNull: true },
  reps:     { type: DataTypes.INTEGER, allowNull: true },
  duration: { type: DataTypes.INTEGER, allowNull: true },
  day:      { type: DataTypes.INTEGER, allowNull: true },
  order:    { type: DataTypes.INTEGER, allowNull: true },
}, {
  tableName: 'ProgramExercises',
  timestamps: true,
});

module.exports = ProgramExercise;
