const { User, Achievement, UserAchievement, SecurityQuestion } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Sequelize } = require('sequelize');



exports.getUsers = async (req, res) => {
  const users = await User.findAll();
  res.json(users);
};

const generateToken = (user) => {
  console.log("JWT_SECRET:", process.env.JWT_SECRET);
  console.log("JWT_EXPIRES_IN:", process.env.JWT_EXPIRES_IN);
  return jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
  );
};

exports.registerUser = async (req, res) => {
  const { username, email, password, securityQuestionId, securityAnswer } = req.body;
  try {
    // Validate that a security question was picked
    if (!securityQuestionId || !securityAnswer) {
      return res.status(400).json({ error: 'Security question and answer are required' });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Create user — password and answer are hashed in beforeCreate hook
    const user = await User.create({
      username,
      email,
      password,
      securityQuestionId,
      securityAnswer
    });

    const token = generateToken(user);

    res.status(201).json({
      user: { id: user.id, username: user.username, email: user.email },
      token
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.loginUser = async (req, res) => {
  
  const { email, password } = req.body;
  try {
    console.log("➡️ Starting login for:", email);
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    console.log("✅ User found:", user.email);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("✅ Password check:", isMatch);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    // 🏆 --- LOGIN STREAK LOGIC ---
    console.log("➡️ Updating streak...");
    const now = new Date();
    const today = new Date(now.toDateString()); // strip time
    let streak = user.loginStreak || 0;

    if (user.lastLogin) {
      const lastLoginDate = new Date(user.lastLogin);
      const lastLoginDay = new Date(lastLoginDate.toDateString()); // strip time

      const diffDays = Math.floor((today - lastLoginDay) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        streak += 1; // consecutive day
      } else if (diffDays > 1) {
        streak = 1; // reset streak
      }
      // if diffDays === 0 → same day login, streak unchanged
    } else {
      streak = 1; // first login
    }

    user.loginStreak = streak;
    user.maxStreak = Math.max(user.maxStreak || 0, streak);
    user.lastLogin = now;
    await user.save();
    console.log("✅ Streak updated");

    // 🎖️ Achievement unlock example
  console.log("➡️ Checking achievements...");
  let newAchievement = null;
  const achievements = await Achievement.findAll({ where: { type: 'login_streak' } });
  console.log("✅ Achievements checked:", achievements.length);

  for (const ach of achievements) {
    if (user.loginStreak >= ach.threshold) {
      // check if user already has it
      const hasIt = await UserAchievement.findOne({
        where: { userId: user.id, achievementId: ach.id }
      });
      if (!hasIt) {
        await UserAchievement.create({ userId: user.id, achievementId: ach.id });
        newAchievement = ach.name; // send back to frontend
      }
    }
  }

    const token = generateToken(user);
    console.log("✅ Token generated");

    res.json({
      user: {
        id: user.id,
        username: user.username,
        streak: user.loginStreak,
        maxStreak: user.maxStreak,
        achievementUnlocked: newAchievement
      },
      token
    });
  } catch (err) {
    console.error("🔥 Login error:", err);
    res.status(500).json({ error: err.message });
  }
};


exports.getSecurityQuestion = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({
      where: { email },
      include: { model: SecurityQuestion, attributes: ['question'] }
    });
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ securityQuestion: user.SecurityQuestion.question });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.resetPasswordWithSecurityQuestion = async (req, res) => {
  const { email, securityAnswer, newPassword } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Check security answer
    const normalizedInput = req.body.securityAnswer.trim().toLowerCase();
    const isMatch = await bcrypt.compare(normalizedInput, user.securityAnswer);
    if (!isMatch) return res.status(401).json({ error: 'Incorrect answer' });

    // Check if new password is the same as old
    const samePassword = await bcrypt.compare(newPassword, user.password);
    if (samePassword) {
      return res.status(400).json({ error: 'New password cannot be the same as the old password' });
    }

    // Hash and update password
   // const salt = await bcrypt.genSalt(10);
    //user.password = await bcrypt.hash(newPassword, salt);
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// controllers/userController.js
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'username', 'email', 'bio'] // no password!
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// controllers/userController.js
exports.updateProfile = async (req, res) => {
  try {
    const { bio, username } = req.body;
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // ✅ allow updating bio + username
    if (bio !== undefined) user.bio = bio;
    if (username !== undefined) user.username = username;

    await user.save();

    res.json({
      message: 'Profile updated',
      user: { id: user.id, username: user.username, bio: user.bio }
    });
  } catch (err) {
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({ error: 'Username already taken' });
  }
  res.status(500).json({ error: err.message });
}

};

exports.getUserStreak = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['loginStreak', 'maxStreak']
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({
      streak: user.loginStreak,
      maxStreak: user.maxStreak
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
