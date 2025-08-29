const { Program, User, Exercise, ProgramExercise } = require('../models');
const axios = require('axios');

// Create a new program
exports.createProgram = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Example: user ID comes from JWT auth
    const createdBy = req.user.id; 

    const program = await Program.create({ name, description, createdBy });
    res.status(201).json(program);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all programs
exports.getPrograms = async (req, res) => {
  try {
    const programs = await Program.findAll({
      include: { model: User, attributes: ['id', 'username'] }
    });
    res.json(programs);
  } catch (err) {
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
    const programId = req.params.id; // 👈 comes from the URL
    const { exerciseId, sets, reps, duration, day, order } = req.body;

    const program = await Program.findByPk(programId);
    if (!program) return res.status(404).json({ error: 'Program not found' });

    const exercise = await Exercise.findByPk(exerciseId);
    if (!exercise) return res.status(404).json({ error: 'Exercise not found' });

    await program.addExercise(exercise, {
      through: { sets, reps, duration, day, order }
    });

    res.json({ message: 'Exercise added to program successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getProgramWithExercises = async (req, res) => {
  try {
    const program = await Program.findByPk(req.params.id, {
      include: [
        { model: User, attributes: ['id', 'username'] },
        {
          model: Exercise,
          through: {
            attributes: ['sets', 'reps', 'duration', 'day', 'order'] // join table fields
          }
        }
      ]
    });

    if (!program) return res.status(404).json({ error: 'Program not found' });

    res.json(program);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addExerciseFromAPIToProgram = async (req, res) => {
  try {
    const programId = req.params.id; // Program ID from URL
    const { apiExerciseId, sets, reps, duration, day, order } = req.body;

    // 1. Find program
    const program = await Program.findByPk(programId);
    if (!program) return res.status(404).json({ error: 'Program not found' });

    // 2. Check if exercise already exists in DB
    let exercise = await Exercise.findOne({ where: { sourceId: apiExerciseId } });

    // 3. If not found, import from ExerciseDB API
    if (!exercise) {
      const response = await axios.get(
        `https://exercisedb.p.rapidapi.com/exercises/exercise/${apiExerciseId}`,
        {
          headers: {
            'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
            'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
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
        instructions: ex.instructions ? ex.instructions.join('\n') : null,
        description: ex.description || null,
        difficulty: ex.difficulty || null,
        category: ex.category || null,
        secondaryMuscles: ex.secondaryMuscles ? ex.secondaryMuscles.join(',') : null,
      });
    }

    // 4. Link to program with metadata
    await program.addExercise(exercise, {
      through: { sets, reps, duration, day, order }
    });

    res.json({ message: 'Exercise added to program successfully', exercise });
  } catch (err) {
    console.error("Error adding exercise:", err);
    res.status(500).json({ error: err.message });
  }
};