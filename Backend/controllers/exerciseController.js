// controllers/exerciseController.js
const { Exercise, Program } = require('../models');
const axios = require('axios');

exports.createExercise = async (req, res) => {
  try {
    const { name, description, difficulty, instructions, programId } = req.body;

    const program = await Program.findByPk(programId);
    if (!program) return res.status(404).json({ error: 'Program not found' });

    const exercise = await Exercise.create({ name, description, difficulty, instructions, programId });
    res.status(201).json(exercise);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getExercises = async (req, res) => {
  try {
    const exercises = await Exercise.findAll({ include: Program });
    res.json(exercises);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getExerciseById = async (req, res) => {
  try {
    const exercise = await Exercise.findByPk(req.params.id, { include: Program });
    if (!exercise) return res.status(404).json({ error: 'Exercise not found' });
    res.json(exercise);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateExercise = async (req, res) => {
  try {
    const { name, description, difficulty, instructions } = req.body;
    const exercise = await Exercise.findByPk(req.params.id);
    if (!exercise) return res.status(404).json({ error: 'Exercise not found' });

    await exercise.update({ name, description, difficulty, instructions });
    res.json({ message: 'Exercise updated', exercise });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteExercise = async (req, res) => {
  try {
    const exercise = await Exercise.findByPk(req.params.id);
    if (!exercise) return res.status(404).json({ error: 'Exercise not found' });

    await exercise.destroy();
    res.json({ message: 'Exercise deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.importFromAPI = async (req, res) => {
  try {
    const { bodyPart } = req.query; // optional filter
    const apiUrl = bodyPart
      ? `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${bodyPart}`
      : `https://exercisedb.p.rapidapi.com/exercises`;

    const response = await axios.get(apiUrl, {
      headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_KEY,
        'x-rapidapi-host': 'exercisedb.p.rapidapi.com',
      },
    });

    const exercises = response.data;

    let imported = 0;
    for (let ex of exercises) {
      const exists = await Exercise.findOne({ where: { sourceId: ex.id } });
      if (!exists) {
        await Exercise.create({
          name: ex.name,
          targetMuscle: ex.target,
          equipment: ex.equipment,
          bodyPart: ex.bodyPart,
          sourceId: ex.id,
          instructions: ex.instructions ? ex.instructions.join('\n') : null,
          description: ex.description || null,
          difficulty: ex.difficulty || null,
          category: ex.category || null,
          secondaryMuscles: ex.secondaryMuscles ? ex.secondaryMuscles.join(',') : null
        });
        imported++;
      }
    }

    res.json({ message: `Imported ${imported} new exercises` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
