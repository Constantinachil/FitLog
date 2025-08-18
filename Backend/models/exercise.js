const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Exercise = sequelize.define('Exercise', {
  name: { type: DataTypes.STRING, allowNull: false },
  targetMuscle: { type: DataTypes.STRING },
  equipment: { type: DataTypes.STRING },
  gifUrl: { type: DataTypes.STRING },
  bodyPart: { type: DataTypes.STRING },
  sourceId: { type: DataTypes.STRING, unique: true },
  instructions: { type: DataTypes.TEXT },
}, {
  tableName: 'Exercises',
  timestamps: true,
});

module.exports = Exercise;
