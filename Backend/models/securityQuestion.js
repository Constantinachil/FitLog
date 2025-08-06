const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const SecurityQuestion = sequelize.define('SecurityQuestion', {
  question: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = SecurityQuestion;
