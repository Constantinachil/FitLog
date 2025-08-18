const sequelize = require('../config/db');
const User = require('./user');
const Exercise = require('./exercise');
const SecurityQuestion = require('./securityQuestion');
const Program = require('./program');
const ProgramExercise = require('./programExercise');

// Define associations if any
User.belongsTo(SecurityQuestion, { foreignKey: 'securityQuestionId' });
SecurityQuestion.hasMany(User, { foreignKey: 'securityQuestionId' });

Program.belongsToMany(Exercise, { through: ProgramExercise, foreignKey: 'programId' });
Exercise.belongsToMany(Program, { through: ProgramExercise, foreignKey: 'exerciseId' });

User.hasMany(Program, { foreignKey: 'createdBy' });
Program.belongsTo(User, { foreignKey: 'createdBy' });


sequelize.sync({ alter: true })
  .then(() => console.log('Database synced'))
  .catch(err => console.error(err));
 // Creates tables if not exist

module.exports = { sequelize, User, SecurityQuestion , Program, Exercise, ProgramExercise };
