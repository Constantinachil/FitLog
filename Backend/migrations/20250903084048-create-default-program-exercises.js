"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("DefaultProgramExercises", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      defaultProgramId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "DefaultPrograms", key: "id" },
        onDelete: "CASCADE",
      },
      exerciseId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Exercises", key: "id" },
        onDelete: "CASCADE",
      },
      day: {
        type: Sequelize.INTEGER,
      },
      order: {
        type: Sequelize.INTEGER,
      },
      sets: {
        type: Sequelize.INTEGER,
      },
      reps: {
        type: Sequelize.INTEGER,
      },
      duration: {
        type: Sequelize.STRING,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("DefaultProgramExercises");
  },
};
