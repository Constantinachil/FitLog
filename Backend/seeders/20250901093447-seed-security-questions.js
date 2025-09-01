'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('SecurityQuestions', [
      { question: 'What is your favorite movie?', createdAt: new Date(), updatedAt: new Date() },
      { question: 'What is your mother’s maiden name?', createdAt: new Date(), updatedAt: new Date() },
      { question: 'What city were you born in?', createdAt: new Date(), updatedAt: new Date() }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('SecurityQuestions', null, {});
  }
};
