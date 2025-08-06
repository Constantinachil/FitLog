const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ProgramExercise = sequelize.define('ProgramExercise', {
  sets: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  reps: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  duration: {
    type: DataTypes.INTEGER, // in seconds or minutes
    allowNull: true
  },
  day: {
    type: DataTypes.INTEGER, // 1 = Monday, 7 = Sunday
    allowNull: true
  }
}, {
  timestamps: false
});

module.exports = ProgramExercise;
