"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("UserAchievements", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users", // adjust if your table is named differently
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      achievementId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Achievements",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      unlockedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
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

    // prevent duplicate achievements per user
    await queryInterface.addIndex("UserAchievements", ["userId", "achievementId"], {
      unique: true,
      name: "ua_user_achievement_unique",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("UserAchievements");
  },
};
