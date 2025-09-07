const { Achievement } = require("../models");

const defaultAchievements = [
  // Programs made
  { key: "programs_1", name: "Rookie Creator", description: "Created 1 program", category: "programs_made", threshold: 1 },
  { key: "programs_5", name: "Planner", description: "Created 5 programs", category: "programs_made", threshold: 5 },
  { key: "programs_10", name: "Master Coach", description: "Created 10 programs", category: "programs_made", threshold: 10 },

  // Exercises added
  { key: "exercises_1", name: "First Step", description: "Added 1 exercise", category: "exercises_added", threshold: 1 },
  { key: "exercises_10", name: "Exercise Enthusiast", description: "Added 10 exercises", category: "exercises_added", threshold: 10 },
  { key: "exercises_25", name: "Exercise Architect", description: "Added 25 exercises", category: "exercises_added", threshold: 25 },

  // Sticky notes
  { key: "notes_1", name: "Note Taker", description: "Used 1 sticky note", category: "sticky_notes_used", threshold: 1 },
  { key: "notes_10", name: "Organizer", description: "Used 10 sticky notes", category: "sticky_notes_used", threshold: 10 },
  { key: "notes_30", name: "Strategist", description: "Used 30 sticky notes", category: "sticky_notes_used", threshold: 30 },

  // 🔥 Login streaks
  { key: "streak_1", name: "Getting Started", description: "Logged in 1 day in a row", category: "login_streak", threshold: 1 },
  { key: "streak_7", name: "One Week Strong", description: "Logged in 7 days in a row", category: "login_streak", threshold: 7 },
  { key: "streak_30", name: "One Month Champion", description: "Logged in 30 days in a row", category: "login_streak", threshold: 30 },
];

async function initAchievements() {
  for (const ach of defaultAchievements) {
    await Achievement.findOrCreate({
      where: { key: ach.key },
      defaults: ach,
    });
  }
  console.log("✅ Achievements initialized");
}

module.exports = initAchievements;
