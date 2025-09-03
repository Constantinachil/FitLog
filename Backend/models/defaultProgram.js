const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const DefaultProgram = sequelize.define(
  "DefaultProgram",
  {
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING },
    difficulty: {
      type: DataTypes.ENUM("Beginner", "Intermediate", "Advanced"),
      allowNull: false,
    },
  },
  {
    tableName: "DefaultPrograms", // ✅ matches migration
    timestamps: true,
  }
);

module.exports = DefaultProgram;
