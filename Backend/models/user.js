const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    set(value) {
    this.setDataValue('email', value.toLowerCase());
  }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  securityQuestionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'SecurityQuestions', key: 'id' }
  },
  securityAnswer: { type: DataTypes.STRING, allowNull: false },
  bio: { type: DataTypes.TEXT, allowNull: true },
  lastLogin: { type: DataTypes.DATE, allowNull: true },
  loginStreak: { type: DataTypes.INTEGER, defaultValue: 0 },
  maxStreak: { type: DataTypes.INTEGER, defaultValue: 0 }
});

// Hash password before saving
User.beforeCreate(async (user) => {
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  const normalizedAnswer = user.securityAnswer.trim().toLowerCase();
  user.securityAnswer = await bcrypt.hash(normalizedAnswer, salt);
});

User.beforeUpdate(async (user) => {
  if (user.changed('password')) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
  if (user.changed('securityAnswer')) {
    const salt = await bcrypt.genSalt(10);
    const normalizedAnswer = user.securityAnswer.trim().toLowerCase();
    user.securityAnswer = await bcrypt.hash(normalizedAnswer, salt);
  }
});

module.exports = User;
