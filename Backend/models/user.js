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
  securityAnswer: { type: DataTypes.STRING, allowNull: false }
});

// Hash password before saving
User.beforeCreate(async (user) => {
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  user.securityAnswer = await bcrypt.hash(user.securityAnswer, salt);
});

User.beforeUpdate(async (user) => {
  if (user.changed('password')) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
  if (user.changed('securityAnswer')) {
    const salt = await bcrypt.genSalt(10);
    user.securityAnswer = await bcrypt.hash(user.securityAnswer, salt);
  }
});

module.exports = User;
