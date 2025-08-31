const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const protect = require('../middlewares/authMiddleware');

router.get('/', userController.getUsers);
router.post('/register', userController.registerUser);
router.post('/forgot-password/question', userController.getSecurityQuestion);
router.post('/forgot-password/reset', userController.resetPasswordWithSecurityQuestion);
router.post('/login', userController.loginUser);
router.get('/profile', protect, userController.getProfile);
router.put('/profile', protect, userController.updateProfile);
router.get('/profile', protect, (req, res) => {
  res.json({ message: `Hello ${req.user.username}!` });
});

module.exports = router;
