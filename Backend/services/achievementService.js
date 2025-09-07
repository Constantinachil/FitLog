const { Program, ProgramExercise, StickyNote, User, Achievement, UserAchievement } = require("../models");

/**
 * Check user progress for a given category and award new achievements
 * @param {number} userId - The user’s ID
 * @param {string} category - One of: "programs_made", "exercises_added", "sticky_notes_used", "login_streak"
 */
async function checkProgressAndAward(userId, category) {
  let count = 0;

  if (category === "programs_made") {
    // Count programs created by this user
    count = await Program.count({ where: { createdBy: userId } });

  } else if (category === "exercises_added") {
    // Count exercises linked to programs created by this user
    count = await ProgramExercise.count({
      include: [
        {
          model: Program,
          where: { createdBy: userId },
        },
      ],
    });

  } else if (category === "sticky_notes_used") {
    // Count sticky notes created by this user
    count = await StickyNote.count({ where: { userId } });

  } else if (category === "login_streak") {
    // Get login streak from User table
    const user = await User.findByPk(userId);
    count = user ? user.loginStreak : 0;
  }

  // Fetch all achievements for this category
  const achievements = await Achievement.findAll({ where: { category } });

  const newlyUnlocked = [];

  for (const ach of achievements) {
    if (count >= ach.threshold) {
      // Check if user already has this achievement
      const hasIt = await UserAchievement.findOne({
        where: { userId, achievementId: ach.id },
      });

      if (!hasIt) {
        await UserAchievement.create({ userId, achievementId: ach.id });
        newlyUnlocked.push(ach.name);
      }
    }
  }

  return { count, newlyUnlocked };
}

module.exports = { checkProgressAndAward };
