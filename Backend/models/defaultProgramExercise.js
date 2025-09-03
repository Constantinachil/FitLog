const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const DefaultProgramExercise = sequelize.define(
  "DefaultProgramExercise",
  {
    day: DataTypes.INTEGER,
    order: DataTypes.INTEGER,
    sets: DataTypes.INTEGER,
    reps: DataTypes.INTEGER,
    duration: DataTypes.STRING,
  },
  {
    tableName: "DefaultProgramExercises", // ✅ match migration
    timestamps: true,
  }
);

module.exports = DefaultProgramExercise;
