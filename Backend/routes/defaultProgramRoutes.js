const express = require("express");
const { DefaultProgram } = require("../models");
const defaultProgramController = require("../controllers/defaultProgramController");

const router = express.Router();

router.post("/:defaultProgramId/exercises", defaultProgramController.addExerciseToDefaultProgram);
router.get("/:id/exercises", defaultProgramController.getDefaultProgramExercises);
router.get("/:id/details", defaultProgramController.getDefaultProgramWithExercises);

// GET all default programs
router.get("/", async (req, res) => {
  try {
    const programs = await DefaultProgram.findAll();
    res.json(programs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
