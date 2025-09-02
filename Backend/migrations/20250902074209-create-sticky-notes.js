"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("StickyNotes", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      content: { type: Sequelize.STRING(500), allowNull: false },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Users", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
    await queryInterface.addIndex("StickyNotes", ["userId"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("StickyNotes");
  },
};
