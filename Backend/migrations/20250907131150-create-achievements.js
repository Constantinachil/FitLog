"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Achievements", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      key: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true, // e.g. "programs_5"
      },
      name: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING(500),
      },
      category: {
        type: Sequelize.STRING(50),
        allowNull: false, // e.g. "programs_made", "exercises_added"
      },
      threshold: {
        type: Sequelize.INTEGER,
        allowNull: false, // e.g. 5 programs
      },
      icon: {
        type: Sequelize.STRING(200), // optional path/URL
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Achievements");
  },
};
