const sequelize = require('../config/db');
const User = require('./user');
const SecurityQuestion = require('./securityQuestion');

// Define associations if any
User.belongsTo(SecurityQuestion, { foreignKey: 'securityQuestionId' });
SecurityQuestion.hasMany(User, { foreignKey: 'securityQuestionId' });

sequelize.sync(); // Creates tables if not exist

module.exports = { sequelize, User, SecurityQuestion };
