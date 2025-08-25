const express = require('express');
const router = express.Router();
const programController = require('../controllers/programController');
const protect = require('../middlewares/authMiddleware'); // JWT auth middleware

router.post('/', protect, programController.createProgram);
router.get('/', protect, programController.getPrograms);
router.get('/:id', protect, programController.getProgramById);
router.put('/:id', protect, programController.updateProgram);
router.delete('/:id', protect, programController.deleteProgram);
router.post('/:id/exercises', protect, programController.addExerciseToProgram);
router.get('/:id/details', protect, programController.getProgramWithExercises);


module.exports = router;
