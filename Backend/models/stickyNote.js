// models/StickyNote.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const StickyNote = sequelize.define(
  "StickyNote",
  {
    content: {
      type: DataTypes.STRING(500),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 500],
      },
    },
    // Optional extras you can add later:
    // color: DataTypes.STRING(20),
    // position: DataTypes.JSON, // {x:0, y:0}
  },
  {
    tableName: "StickyNotes",
    timestamps: true,
  }
);

module.exports = StickyNote;
