const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const UserAchievement = sequelize.define("UserAchievement", {
  userId: { type: DataTypes.INTEGER, allowNull: false },
  achievementId: { type: DataTypes.INTEGER, allowNull: false },
  unlockedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

module.exports = UserAchievement;
