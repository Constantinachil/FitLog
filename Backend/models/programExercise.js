const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ProgramExercise = sequelize.define('ProgramExercise', {
  // optional metadata per program-exercise pairing:
  sets:      { type: DataTypes.INTEGER, allowNull: true },
  reps:      { type: DataTypes.INTEGER, allowNull: true },
  duration:  { type: DataTypes.INTEGER, allowNull: true }, // seconds or minutes
  day:       { type: DataTypes.INTEGER, allowNull: true }, // 1..7 if you want weekly plan later
  order:     { type: DataTypes.INTEGER, allowNull: true }, // display order inside a day
}, {
  tableName: 'ProgramExercises',
  timestamps: true,
});

module.exports = ProgramExercise;
