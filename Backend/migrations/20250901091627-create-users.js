'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // SecurityQuestions
    await queryInterface.createTable('SecurityQuestions', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      question: { type: Sequelize.STRING, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    // Users
    await queryInterface.createTable('Users', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      username: { type: Sequelize.STRING, allowNull: false, unique: true },
      email: { type: Sequelize.STRING, allowNull: false, unique: true },
      password: { type: Sequelize.STRING, allowNull: false },
      bio: { type: Sequelize.TEXT },
      securityQuestionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'SecurityQuestions', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'NO ACTION'
      },
      securityAnswer: { type: Sequelize.STRING, allowNull: false },
      lastLogin: { type: Sequelize.DATE },
      loginStreak: { type: Sequelize.INTEGER, defaultValue: 0 },
      maxStreak: { type: Sequelize.INTEGER, defaultValue: 0 },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    // Programs
    await queryInterface.createTable('Programs', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      description: { type: Sequelize.TEXT },
      createdBy: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    // Exercises
    await queryInterface.createTable('Exercises', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      targetMuscle: { type: Sequelize.STRING },
      equipment: { type: Sequelize.STRING },
      bodyPart: { type: Sequelize.STRING },
      sourceId: { type: Sequelize.STRING, unique: true },
      instructions: { type: Sequelize.TEXT },
      description: { type: Sequelize.TEXT },
      difficulty: { type: Sequelize.STRING },
      category: { type: Sequelize.STRING },
      secondaryMuscles: { type: Sequelize.STRING }, // CSV string
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    // ProgramExercises (join table)
    await queryInterface.createTable('ProgramExercises', {
      programId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: { model: 'Programs', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      exerciseId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: { model: 'Exercises', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      sets: { type: Sequelize.INTEGER },
      reps: { type: Sequelize.INTEGER },
      duration: { type: Sequelize.INTEGER },
      day: { type: Sequelize.INTEGER },
      order: { type: Sequelize.INTEGER },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

  },

  async down(queryInterface) {
    await queryInterface.dropTable('ProgramExercises');
    await queryInterface.dropTable('Exercises');
    await queryInterface.dropTable('Programs');
    await queryInterface.dropTable('Users');
    await queryInterface.dropTable('SecurityQuestions');
  }
};
