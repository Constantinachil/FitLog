const { sequelize, SecurityQuestion } = require('./models');

(async () => {
  await sequelize.sync({ force: false }); // No data loss
  await SecurityQuestion.bulkCreate([
    { question: 'What is your favorite movie?' },
    { question: 'What is your mother’s maiden name?' },
    { question: 'What city were you born in?' }
  ], { ignoreDuplicates: true });
  console.log('Security questions seeded!');
  process.exit();
})();
