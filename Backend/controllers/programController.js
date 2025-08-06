const { Program, User } = require('../models');

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
