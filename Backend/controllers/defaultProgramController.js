const { DefaultProgram, Exercise, DefaultProgramExercise } = require("../models");

exports.addExerciseToDefaultProgram = async (req, res) => {
  try {
    const { defaultProgramId } = req.params;
    const { exerciseId, day, order, sets, reps, duration } = req.body;

    console.log("Looking for program id:", defaultProgramId);
    const program = await DefaultProgram.findByPk(defaultProgramId);
    console.log("Program result:", program);

    if (!program) return res.status(404).json({ error: "Default program not found" });

    const exercise = await Exercise.findByPk(exerciseId);
    if (!exercise) return res.status(404).json({ error: "Exercise not found" });

    const link = await DefaultProgramExercise.create({
      defaultProgramId,
      exerciseId,
      day,
      order,
      sets,
      reps,
      duration,
    });

    res.json(link);
  } catch (err) {
    console.error("🔥 Error adding exercise to default program:", err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.getDefaultProgramExercises = async (req, res) => {
  try {
    const { id } = req.params;

    const program = await DefaultProgram.findByPk(id, {
      include: [
        {
          model: Exercise,
          through: { attributes: ["day", "order", "sets", "reps", "duration"] },
        },
      ],
    });

    if (!program) {
      return res.status(404).json({ error: "Default program not found" });
    }

    res.json(program.Exercises);
  } catch (err) {
    console.error("🔥 Error fetching program exercises:", err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.getDefaultProgramWithExercises = async (req, res) => {
  try {
    const { id } = req.params;

    const program = await DefaultProgram.findByPk(id, {
      include: [
        {
          model: Exercise,
          through: {
            attributes: ["day", "order", "sets", "reps", "duration"],
          },
        },
      ],
    });

    if (!program) {
      return res.status(404).json({ error: "Default program not found" });
    }

    res.json(program);
  } catch (err) {
    console.error("🔥 Error fetching program with exercises:", err.message);
    res.status(500).json({ error: err.message });
  }
};