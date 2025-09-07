const { Achievement, UserAchievement } = require("../models");

// Get all achievements for the logged-in user
exports.myAchievements = async (req, res) => {
  try {
    const userId = req.user.id;

    // get all achievements
    const achievements = await Achievement.findAll();

    // get unlocked achievements for this user
    const unlocked = await UserAchievement.findAll({ where: { userId } });
    const unlockedIds = new Set(unlocked.map(u => u.achievementId));

    // build response
    const result = achievements.map(a => ({
      id: a.id,
      key: a.key,
      name: a.name,
      description: a.description,
      category: a.category,
      threshold: a.threshold,
      unlocked: unlockedIds.has(a.id),
    }));

    res.json(result);
  } catch (err) {
    console.error("🔥 Error fetching achievements:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get only unlocked achievements (if you need it)
exports.myUnlockedAchievements = async (req, res) => {
  try {
    const userId = req.user.id;

    const unlocked = await UserAchievement.findAll({
      where: { userId },
      include: [{ model: Achievement }],
    });

    res.json(
      unlocked.map(u => ({
        id: u.Achievement.id,
        key: u.Achievement.key,
        name: u.Achievement.name,
        description: u.Achievement.description,
        category: u.Achievement.category,
        threshold: u.Achievement.threshold,
        unlockedAt: u.unlockedAt,
      }))
    );
  } catch (err) {
    console.error("🔥 Error fetching unlocked achievements:", err);
    res.status(500).json({ error: err.message });
  }
};
