const express = require('express');
const router = express.Router();
const exerciseController = require('../controllers/exerciseController');
const { protect } = require('../middlewares/authMiddleware');
const { importFromAPI } = require('../controllers/exerciseController');



router.post('/', protect, exerciseController.createExercise);
router.get('/', protect, exerciseController.getExercises);
router.get('/:id', protect, exerciseController.getExerciseById);
router.put('/:id', protect, exerciseController.updateExercise);
router.delete('/:id', protect, exerciseController.deleteExercise);
router.get('/import', protect, importFromAPI);

module.exports = router;
