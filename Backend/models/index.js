const sequelize = require('../config/db');
const User = require('./user');
const Exercise = require('./exercise');
const SecurityQuestion = require('./securityQuestion');
const Program = require('./program');
const ProgramExercise = require('./programExercise');
const Achievement = require('./achievement');
const UserAchievement = require('./userAchievement');
const StickyNote = require('./stickyNote');
const DefaultProgram = require('./defaultProgram');
const DefaultProgramExercise = require('./defaultProgramExercise');


// Define associations if any
User.belongsTo(SecurityQuestion, { foreignKey: 'securityQuestionId' });
SecurityQuestion.hasMany(User, { foreignKey: 'securityQuestionId' });

Program.belongsToMany(Exercise, { through: ProgramExercise, foreignKey: 'programId' });
Exercise.belongsToMany(Program, { through: ProgramExercise, foreignKey: 'exerciseId' });

User.hasMany(Program, { foreignKey: 'createdBy'});
Program.belongsTo(User, { foreignKey: 'createdBy'});

User.belongsToMany(Achievement, { through: UserAchievement, foreignKey: 'userId' });
Achievement.belongsToMany(User, { through: UserAchievement, foreignKey: 'achievementId' });

User.hasMany(StickyNote, { foreignKey: 'userId' });
StickyNote.belongsTo(User, { foreignKey: 'userId' });

DefaultProgram.belongsToMany(Exercise, {
  through: DefaultProgramExercise,
  foreignKey: "defaultProgramId",
  otherKey: "exerciseId",
});

Exercise.belongsToMany(DefaultProgram, {
  through: DefaultProgramExercise,
  foreignKey: "exerciseId",
  otherKey: "defaultProgramId",
});



sequelize.authenticate()
  .then(() => console.log('Database connected'))
  .catch(err => console.error(err));

 // Creates tables if not exist

module.exports = { sequelize, User, SecurityQuestion , Program, Exercise, ProgramExercise, Achievement, UserAchievement, StickyNote, DefaultProgram, DefaultProgramExercise };
