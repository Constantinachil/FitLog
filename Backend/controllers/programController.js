const { Program, User, Exercise, ProgramExercise } = require('../models');
const axios = require('axios');
const { checkProgressAndAward } = require("../services/achievementService");
// Create a new program
exports.createProgram = async (req, res) => {
  try {
    const { name, description } = req.body;

    // User ID comes from JWT auth middleware
    const userId = req.user.id;

    // Create program
    const program = await Program.create({
      name,
      description: description || "",
      createdBy: userId,
    });

    // Check achievements
    const result = await checkProgressAndAward(userId, "programs_made");

    return res.status(201).json({
      program,
      achievementsUnlocked: result.newlyUnlocked,
    });
  } catch (err) {
    console.error("❌ Error creating program:", err);
    res.status(500).json({ error: err.message });
  }
};


// Get all programs
exports.getPrograms = async (req, res) => {
  try {
    const userId = req.user.id; // comes from auth middleware (JWT)

    const programs = await Program.findAll({
      where: { createdBy: userId }, // ✅ only programs made by this user
      include: { model: User, attributes: ["id", "username"] },
    });

    res.json(programs);
  } catch (err) {
    console.error("Error fetching programs:", err);
    res.status(500).json({ error: err.message });
  }
};


// Get single program by ID
exports.getProgramById = async (req, res) => {
  try {
    const program = await Program.findByPk(req.params.id, {
      include: { model: User, attributes: ['id', 'username'] }
    });

    if (!program) return res.status(404).json({ error: 'Program not found' });
    res.json(program);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a program
exports.updateProgram = async (req, res) => {
  try {
    const { name, description } = req.body;
    const program = await Program.findByPk(req.params.id);

    if (!program) return res.status(404).json({ error: 'Program not found' });

    await program.update({ name, description });
    res.json({ message: 'Program updated successfully', program });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a program
exports.deleteProgram = async (req, res) => {
  try {
    const program = await Program.findByPk(req.params.id);
    if (!program) return res.status(404).json({ error: 'Program not found' });

    await program.destroy();
    res.json({ message: 'Program deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addExerciseToProgram = async (req, res) => {
  try {
    const programId = req.params.id;
    const { exerciseId, apiExerciseId, sets, reps, duration, day, order } = req.body;

    const program = await Program.findByPk(programId);
    if (!program) return res.status(404).json({ error: "Program not found" });

    let exercise;

    if (exerciseId) {
      exercise = await Exercise.findByPk(exerciseId);
      if (!exercise) return res.status(404).json({ error: "Exercise not found" });
    } else if (apiExerciseId) {
      exercise = await Exercise.findOne({ where: { sourceId: apiExerciseId } });

      if (!exercise) {
        const response = await axios.get(
          `https://exercisedb.p.rapidapi.com/exercises/exercise/${apiExerciseId}`,
          {
            headers: {
              "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
              "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
            },
          }
        );

        const ex = response.data;

        exercise = await Exercise.create({
          name: ex.name,
          targetMuscle: ex.target,
          equipment: ex.equipment,
          bodyPart: ex.bodyPart,
          sourceId: ex.id,
          instructions: ex.instructions ? ex.instructions.join("\n") : null,
          description: ex.description || null,
          difficulty: ex.difficulty || null,
          category: ex.category || null,
          secondaryMuscles: ex.secondaryMuscles
            ? ex.secondaryMuscles.join(",")
            : null,
        });
      }
    } else {
      return res.status(400).json({ error: "No exerciseId or apiExerciseId provided" });
    }

    // Link exercise with metadata in the join table
    await program.addExercise(exercise, {
      through: { sets, reps, duration, day, order },
    });

    // Fetch exercise again including join data
    const exerciseWithJoin = await Exercise.findByPk(exercise.id, {
      attributes: [
        "id",
        "name",
        "targetMuscle",
        "equipment",
        "bodyPart",
        "sourceId",
        "instructions",
        "description",
        "difficulty",
        "category",
        "secondaryMuscles",
      ],
      include: [
        {
          model: Program,
          where: { id: programId },
          attributes: ["id", "name"],
          through: {
            attributes: ["sets", "reps", "duration", "day", "order"],
          },
        },
      ],
    });

    // Flatten response for frontend
    const plain = exerciseWithJoin.get({ plain: true });
    if (plain.Programs && plain.Programs.length > 0) {
      plain.ProgramExercise = plain.Programs[0].ProgramExercise;
      delete plain.Programs;
    }

    // Award achievements
    const userId = req.user.id;
    const result = await checkProgressAndAward(userId, "exercises_added");

    // ✅ Send one response
    res.status(201).json({
      exercise: plain,
      achievementsUnlocked: result.newlyUnlocked,
    });
  } catch (err) {
    console.error("Error adding exercise:", err);
    res.status(500).json({ error: err.message });
  }
};





exports.getProgramWithExercises = async (req, res) => {
  try {
    const program = await Program.findByPk(req.params.id, {
      include: [
        {
          model: Exercise,
          through: {
            attributes: ["sets", "reps", "duration", "day", "order"],
          },
        },
      ],
      order: [
        [Exercise, ProgramExercise, "day", "ASC"],   // group by day
        [Exercise, ProgramExercise, "order", "ASC"], // then sort by order
      ],
    });

    if (!program) {
      return res.status(404).json({ error: "Program not found" });
    }

    // ✅ Convert to plain object
    const plain = program.get({ plain: true });

    // ✅ Flatten ProgramExercise so frontend can access directly
    plain.Exercises = plain.Exercises.map((ex) => {
      if (ex.ProgramExercise) {
        ex.ProgramExercise = { ...ex.ProgramExercise };
      }
      return ex;
    });

    res.json(plain);
  } catch (err) {
    console.error("Error fetching program with exercises:", err);
    res.status(500).json({ error: err.message });
  }
};


exports.removeExerciseFromProgram = async (req, res) => {
  try {
    const programId = req.params.id;
    const { exerciseId } = req.body;

    const program = await Program.findByPk(programId);
    if (!program) return res.status(404).json({ error: "Program not found" });

    const exercise = await Exercise.findByPk(exerciseId);
    if (!exercise) return res.status(404).json({ error: "Exercise not found" });

    // remove the association
    await program.removeExercise(exercise);

    res.json({ message: "Exercise removed from program successfully", exerciseId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
