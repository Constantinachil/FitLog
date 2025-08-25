const { Program, User, Exercise, ProgramExercise } = require('../models');

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
