// controllers/exerciseController.js
const { Exercise, Program } = require('../models');
const axios = require('axios');
const { Op } = require("sequelize");
const { checkProgressAndAward } = require("../services/achievementService");


exports.createExercise = async (req, res) => {
  try {
    const {
      name,
      description,
      difficulty,
      instructions,
      bodyPart,
      targetMuscle,
      equipment,
      secondaryMuscles,
      category,
      programId,
      sets,
      reps,
      duration,
      day,
      order,
    } = req.body;

    // ✅ Check if program exists
    const program = await Program.findByPk(programId);
    if (!program) return res.status(404).json({ error: "Program not found" });

    // ✅ Utility: convert "" → null, enforce integer
    const sanitizeInt = (val) => {
      if (val === "" || val === undefined || val === null) return null;
      return parseInt(val, 10);
    };

    // ✅ Create exercise in Exercises table
    const exercise = await Exercise.create({
      name,
      description,
      difficulty,
      instructions,
      bodyPart,
      targetMuscle,
      equipment,
      secondaryMuscles,
      category,
    });

    // ✅ Link exercise to program via join table
    await program.addExercise(exercise, {
      through: {
        sets: sanitizeInt(sets),
        reps: sanitizeInt(reps),
        duration: sanitizeInt(duration),
        day: sanitizeInt(day),
        order: sanitizeInt(order),
      },
    });

    // ✅ Fetch back with ProgramExercise join data
    const exerciseWithJoin = await Exercise.findByPk(exercise.id, {
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

    // ✅ Flatten join for frontend
    const plain = exerciseWithJoin.get({ plain: true });
    if (plain.Programs && plain.Programs.length > 0) {
      plain.ProgramExercise = plain.Programs[0].ProgramExercise;
      delete plain.Programs;
    }

    // ✅ Use program’s owner for achievements
    const userId = program.createdBy;  // or req.user.id if you prefer
    const result = await checkProgressAndAward(userId, "exercises_added");

    return res.status(201).json({
      exercise: plain,
      achievementsUnlocked: result.newlyUnlocked,
    });

  } catch (err) {
    console.error("Error creating exercise:", err);
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
    const { bodyPart, name, nameExact, equipment } = req.query;

    let apiUrl;

    if (name) {
      apiUrl = `https://exercisedb.p.rapidapi.com/exercises/name/${encodeURIComponent(
        name
      )}`;
    } else if (bodyPart) {
      apiUrl = `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${bodyPart}`;
    } else if (equipment) {
      apiUrl = `https://exercisedb.p.rapidapi.com/exercises/equipment/${encodeURIComponent(
        equipment
      )}`;
    } else {
      apiUrl = `https://exercisedb.p.rapidapi.com/exercises`;
    }

    console.log("➡️ Fetching from API:", apiUrl);

    const response = await axios.get(apiUrl, {
      headers: {
        "x-rapidapi-key": process.env.RAPIDAPI_KEY,
        "x-rapidapi-host": "exercisedb.p.rapidapi.com",
      },
    });

    let exercises = Array.isArray(response.data)
      ? response.data
      : [response.data];

    console.log("➡️ API returned:", exercises.length, "results");

    // 🔍 Filter if exact match requested
    if (name && nameExact === "true") {
      exercises = exercises.filter(
        (ex) => ex.name.toLowerCase() === name.toLowerCase()
      );
      console.log("➡️ Exact match filtering applied:", exercises.length, "left");
    }

    if (!exercises.length) {
      return res
        .status(404)
        .json({ error: "No exercises found with the given criteria" });
    }

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
          instructions: ex.instructions ? ex.instructions.join("\n") : null,
          description: ex.description || null,
          difficulty: ex.difficulty || null,
          category: ex.category || null,
          secondaryMuscles: ex.secondaryMuscles
            ? ex.secondaryMuscles.join(",")
            : null,
        });
        imported++;
      }
    }

    res.json({
      message: `Imported ${imported} new exercises`,
      count: exercises.length,
      exercises: exercises.map((e) => e.name),
    });
  } catch (err) {
    console.error("🔥 Error in importFromAPI:", err.response?.data || err.message);
    res.status(500).json({ error: err.message });
  }
};

// Unified search + import
exports.searchAndImportExercise = async (req, res) => {
  try {
    const { query, filter } = req.query;
    if (!query) {
      return res.status(400).json({ error: "Missing query" });
    }

    let apiUrl;
    if (filter === "equipment") {
      apiUrl = `https://exercisedb.p.rapidapi.com/exercises/equipment/${encodeURIComponent(query)}`;
    } else if (filter === "bodyPart") {
      apiUrl = `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${encodeURIComponent(query)}`;
    } else {
      // default: name
      apiUrl = `https://exercisedb.p.rapidapi.com/exercises/name/${encodeURIComponent(query)}`;
    }

    const response = await axios.get(apiUrl, {
      headers: {
        "x-rapidapi-key": process.env.RAPIDAPI_KEY,
        "x-rapidapi-host": "exercisedb.p.rapidapi.com",
      },
    });

    let exercises = Array.isArray(response.data) ? response.data : [response.data];
    if (!exercises.length) {
      return res.status(404).json({ error: "No exercises found" });
    }

    // Save into DB if not exists
    const saved = [];
    for (const ex of exercises) {
      let exercise = await Exercise.findOne({ where: { sourceId: ex.id } });
      if (!exercise) {
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
          secondaryMuscles: ex.secondaryMuscles ? ex.secondaryMuscles.join(",") : null,
        });

      }
      saved.push(exercise);
    }

    res.json(saved);
  } catch (err) {
    console.error("🔥 Error in searchAndImportExercise:", err.response?.data || err.message);
    res.status(500).json({ error: err.message });
  }
};
