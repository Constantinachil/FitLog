const express = require('express');
const router = express.Router();
const { getSecurityQuestions } = require('../controllers/securityQuestionController');

router.get('/', getSecurityQuestions);

module.exports = router;
