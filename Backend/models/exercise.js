const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Exercise = sequelize.define('Exercise', {
  name: { type: DataTypes.STRING, allowNull: false },
  targetMuscle: { type: DataTypes.STRING },
  equipment: { type: DataTypes.STRING },
  bodyPart: { type: DataTypes.STRING },
  sourceId: { type: DataTypes.STRING, unique: true },
  instructions: { type: DataTypes.TEXT },
  description: { type: DataTypes.TEXT },
  difficulty: {type: DataTypes.STRING},
  category: { type: DataTypes.STRING },
  secondaryMuscles: { 
    type: DataTypes.TEXT, // store as comma-separated list
    get() {
      const rawValue = this.getDataValue('secondaryMuscles');
      return rawValue ? rawValue.split(',') : [];
    },
    set(value) {
      this.setDataValue('secondaryMuscles', Array.isArray(value) ? value.join(',') : value);
    }
  }

}, {
  tableName: 'Exercises',
  timestamps: true,
});

module.exports = Exercise;
