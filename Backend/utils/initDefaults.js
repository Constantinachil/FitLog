const axios = require("axios");
const {
  DefaultProgram,
  Exercise,
  DefaultProgramExercise,
} = require("../models");

async function initDefaultPrograms() {
  try {
    const existing = await DefaultProgram.count();
    if (existing > 0) {
      console.log("✅ Default programs already exist, skipping init.");
      return;
    }

    console.log("⚡ Initializing default programs...");

    const defaultPrograms = [
      // Beginner
      {
        name: "Beginner Full Body",
        description: "Basic full-body workouts for beginners",
        category: "Beginner",
        difficulty: "Beginner",
        query: { type: "bodyPart", value: "chest" },
        sets: 2,
        reps: 10,
        duration: null,
      },
      {
        name: "Cardio Starter",
        description: "Light cardio-focused starter plan",
        category: "Beginner",
        difficulty: "Beginner",
        query: { type: "bodyPart", value: "cardio" },
        sets: null,
        reps: null,
        duration: "10 mins",
      },
      {
        name: "Core & Mobility",
        description: "Core strengthening and mobility",
        category: "Beginner",
        difficulty: "Beginner",
        query: { type: "target", value: "abs" },
        sets: 2,
        reps: 12,
        duration: null,
      },
      // Intermediate
      {
        name: "Strength Builder",
        description: "Progressive overload for strength",
        category: "Intermediate",
        difficulty: "Intermediate",
        query: { type: "equipment", value: "barbell" },
        sets: 3,
        reps: 8,
        duration: null,
      },
      {
        name: "Cardio Endurance",
        description: "Improve stamina and endurance",
        category: "Intermediate",
        difficulty: "Intermediate",
        query: { type: "bodyPart", value: "cardio" },
        sets: null,
        reps: null,
        duration: "20 mins",
      },
      {
        name: "Hypertrophy Split",
        description: "Muscle growth split routine",
        category: "Intermediate",
        difficulty: "Intermediate",
        query: { type: "target", value: "biceps" },
        sets: 4,
        reps: 12,
        duration: null,
      },
      // Advanced
    {
    name: "Powerlifting Prep",
    description: "Compound movements for strength",
    category: "Advanced",
    difficulty: "Advanced",
    query: { type: "target", value: "quads" },
    sets: 5,
    reps: 5,
    duration: null,
    },
    {
    name: "HIIT Elite",
    description: "High intensity interval training",
    category: "Advanced",
    difficulty: "Advanced",
    query: { type: "target", value: "cardiovascular system" },
    sets: null,
    reps: null,
    duration: "30 secs work / 15 secs rest x 8 rounds",
    },
    {
    name: "Athlete Conditioning",
    description: "Explosive and athletic performance",
    category: "Advanced",
    difficulty: "Advanced",
    query: { type: "target", value: "triceps" },
    sets: 4,
    reps: 8,
    duration: null,
    },

    ];

    for (const prog of defaultPrograms) {
      // 1️⃣ Create the program
      const program = await DefaultProgram.create({
        name: prog.name,
        description: prog.description,
        category: prog.category,
        difficulty: prog.difficulty,
      });

      // 2️⃣ Build ExerciseDB API URL
      const url = `https://exercisedb.p.rapidapi.com/exercises/${prog.query.type}/${prog.query.value}`;

      // 3️⃣ Fetch exercises
      const res = await axios.get(url, {
        headers: {
          "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
          "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
        },
      });

      // limit to first 5 exercises
      const exercises = res.data.slice(0, 5);

      // 4️⃣ Insert exercises + links
      let day = 1;
      for (let i = 0; i < exercises.length; i++) {
        const ex = exercises[i];

        let exercise = await Exercise.findOne({ where: { sourceId: ex.id } });
        if (!exercise) {
          exercise = await Exercise.create({
            name: ex.name,
            targetMuscle: ex.target,
            equipment: ex.equipment,
            bodyPart: ex.bodyPart,
            sourceId: ex.id,
            instructions: Array.isArray(ex.instructions)
              ? ex.instructions.join("\n")
              : ex.instructions || null,
            description: ex.description || null,
            difficulty: ex.difficulty || "Beginner",
            category: ex.category || "General",
            secondaryMuscles: Array.isArray(ex.secondaryMuscles)
              ? ex.secondaryMuscles.join(", ")
              : ex.secondaryMuscles || null,
          });
        }

        await DefaultProgramExercise.create({
          defaultProgramId: program.id,
          exerciseId: exercise.id,
          sets: prog.sets,
          reps: prog.reps,
          duration: prog.duration,
          day,
          order: i + 1,
        });

        // rotate day every 3 exercises
        if ((i + 1) % 3 === 0) {
          day++;
        }
      }

      console.log(`✅ Created default program: ${prog.name}`);
    }

    console.log("🎉 Default programs initialized successfully!");
  } catch (err) {
    console.error("❌ Error initializing default programs:", err.message);
  }
}

module.exports = { initDefaultPrograms };
