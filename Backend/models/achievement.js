const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Achievement = sequelize.define("Achievement", {
  key: { type: DataTypes.STRING, allowNull: false, unique: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: DataTypes.STRING,
  category: { type: DataTypes.STRING, allowNull: false },
  threshold: { type: DataTypes.INTEGER, allowNull: false },
  icon: DataTypes.STRING,
});

module.exports = Achievement;
