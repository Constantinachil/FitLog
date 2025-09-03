"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("DefaultPrograms", [
      { name: "Beginner Full Body", description: "3-day simple full body plan", difficulty: "Beginner", createdAt: new Date(), updatedAt: new Date() },
      { name: "Cardio Starter", description: "Intro cardio plan", difficulty: "Beginner", createdAt: new Date(), updatedAt: new Date() },
      { name: "Core & Mobility", description: "Core stability & mobility", difficulty: "Beginner", createdAt: new Date(), updatedAt: new Date() },

      { name: "Strength Builder", description: "Progressive strength program", difficulty: "Intermediate", createdAt: new Date(), updatedAt: new Date() },
      { name: "Cardio Endurance", description: "Build endurance", difficulty: "Intermediate", createdAt: new Date(), updatedAt: new Date() },
      { name: "Hypertrophy Split", description: "Muscle growth split", difficulty: "Intermediate", createdAt: new Date(), updatedAt: new Date() },

      { name: "Powerlifting Prep", description: "Squat/Bench/Deadlift focus", difficulty: "Advanced", createdAt: new Date(), updatedAt: new Date() },
      { name: "HIIT Elite", description: "High intensity training", difficulty: "Advanced", createdAt: new Date(), updatedAt: new Date() },
      { name: "Athlete Conditioning", description: "Agility & performance program", difficulty: "Advanced", createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("DefaultPrograms", null, {});
  },
};
