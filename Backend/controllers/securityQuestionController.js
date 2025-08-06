const { SecurityQuestion } = require('../models');

exports.getSecurityQuestions = async (req, res) => {
  try {
    const questions = await SecurityQuestion.findAll({ attributes: ['id', 'question'] });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
