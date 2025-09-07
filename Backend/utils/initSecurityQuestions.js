const { SecurityQuestion } = require("../models");

async function initSecurityQuestions() {
  try {
    const existing = await SecurityQuestion.count();
    if (existing > 0) {
      console.log("✅ Security questions already exist, skipping init.");
      return;
    }

    console.log("⚡ Initializing security questions...");

    const questions = [
      { question: "What is your favorite movie?" },
      { question: "What is your mother’s maiden name?" },
      { question: "What city were you born in?" },
    ];

    for (const q of questions) {
      await SecurityQuestion.create({
        ...q,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    console.log("🎉 Security questions initialized successfully!");
  } catch (err) {
    console.error("❌ Error initializing security questions:", err.message);
  }
}

module.exports = { initSecurityQuestions };
