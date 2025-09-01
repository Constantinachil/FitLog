// models/userAchievement.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const UserAchievement = sequelize.define('UserAchievement', {
  earnedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'UserAchievements',
  timestamps: false
});

module.exports = UserAchievement;
