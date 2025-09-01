const sequelize = require('../config/db');
const User = require('./user');
const Exercise = require('./exercise');
const SecurityQuestion = require('./securityQuestion');
const Program = require('./program');
const ProgramExercise = require('./programExercise');
const Achievement = require('./achievement');
const UserAchievement = require('./userAchievement');

// Define associations if any
User.belongsTo(SecurityQuestion, { foreignKey: 'securityQuestionId' });
SecurityQuestion.hasMany(User, { foreignKey: 'securityQuestionId' });

Program.belongsToMany(Exercise, { through: ProgramExercise, foreignKey: 'programId' });
Exercise.belongsToMany(Program, { through: ProgramExercise, foreignKey: 'exerciseId' });

User.hasMany(Program, { foreignKey: 'createdBy' });
Program.belongsTo(User, { foreignKey: 'createdBy' });

User.belongsToMany(Achievement, { through: UserAchievement, foreignKey: 'userId' });
Achievement.belongsToMany(User, { through: UserAchievement, foreignKey: 'achievementId' });

sequelize.authenticate()
  .then(() => console.log('Database connected'))
  .catch(err => console.error(err));

 // Creates tables if not exist

module.exports = { sequelize, User, SecurityQuestion , Program, Exercise, ProgramExercise, Achievement, UserAchievement };
