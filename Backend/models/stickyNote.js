// models/StickyNote.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const StickyNote = sequelize.define(
  "StickyNote",
  {
    content: {
      type: DataTypes.STRING(500),
      allowNull: false,
      defaultValue: "",        // allow blank note at creation
      validate: {
        len: [0, 500],         // only enforce max length
      },
    },
    x: {
      type: DataTypes.INTEGER,
      defaultValue: 100,       // default X position
    },
    y: {
      type: DataTypes.INTEGER,
      defaultValue: 100,       // default Y position
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,        // links to User
    },
  },
  {
    tableName: "StickyNotes",
    timestamps: true,
  }
);

module.exports = StickyNote;
