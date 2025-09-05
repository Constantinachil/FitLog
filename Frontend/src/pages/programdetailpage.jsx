import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/programdetailpage.css";

export default function ProgramDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [program, setProgram] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilter, setSearchFilter] = useState("name");
  const [searchResults, setSearchResults] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [pickedExerciseIndex, setPickedExerciseIndex] = useState(null);

  const [newExercise, setNewExercise] = useState({
    name: "",
    description: "",
    instructions: "",
    difficulty: "",
    category: "",
    bodyPart: "",
    targetMuscle: "",
    equipment: "",
    secondaryMuscles: "",
    sets: "",
    reps: "",
    duration: "",
    day: "",
    order: "",
  });

  const [showAddExercise, setShowAddExercise] = useState(false);

  // Fetch program details
  useEffect(() => {
    const fetchProgram = async () => {
      try {
        const res = await api.get(`/programs/${id}/details`);
        setProgram(res.data);

        const sorted = [...(res.data.Exercises || [])].sort((a, b) => {
          const dayA = a.ProgramExercise?.day || 0;
          const dayB = b.ProgramExercise?.day || 0;
          if (dayA !== dayB) return dayA - dayB;
          const orderA = a.ProgramExercise?.order || 0;
          const orderB = b.ProgramExercise?.order || 0;
          return orderA - orderB;
        });

        setExercises(sorted);
      } catch (err) {
        console.error("Error fetching program:", err.response?.data || err.message);
      }
    };
    fetchProgram();
  }, [id]);

  // Search from ExerciseDB and import
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      const res = await api.get(
        `/exercises/searchImport?query=${encodeURIComponent(searchQuery)}&filter=${searchFilter}`
      );

      const resultsWithFields = (res.data || []).map((r) => ({
        ...r,
        sets: "",
        reps: "",
        duration: "",
        day: "",
        order: "",
      }));

      setSearchResults(resultsWithFields);
      setPickedExerciseIndex(null);
      setNoResults(resultsWithFields.length === 0);
    } catch (err) {
      console.error("Search failed:", err.response?.data || err.message);
      setSearchResults([]);
      setNoResults(true);
    }
  };

  // Add exercise to program
  const addExerciseToProgram = async (exercise) => {
    try {
      const payload = exercise.id
        ? { exerciseId: exercise.id }
        : { apiExerciseId: exercise.sourceId || exercise.id };

      const res = await api.post(`/programs/${id}/exercises`, {
        ...payload,
        sets: exercise.sets || null,
        reps: exercise.reps || null,
        duration: exercise.duration || null,
        day: exercise.day || null,
        order: exercise.order || null,
      });

      let addedExercise = res.data;
      if (addedExercise.Programs && addedExercise.Programs.length > 0) {
        addedExercise = {
          ...addedExercise,
          ProgramExercise: addedExercise.Programs[0].ProgramExercise,
        };
        delete addedExercise.Programs;
      }

      const updated = [...exercises, addedExercise].sort((a, b) => {
        const dayA = a.ProgramExercise?.day || 0;
        const dayB = b.ProgramExercise?.day || 0;
        if (dayA !== dayB) return dayA - dayB;
        const orderA = a.ProgramExercise?.order || 0;
        const orderB = b.ProgramExercise?.order || 0;
        return orderA - orderB;
      });

      setExercises(updated);
      setPickedExerciseIndex(null);
    } catch (err) {
      console.error("Failed to add exercise:", err.response?.data || err.message);
    }
  };

  // Remove exercise
  const removeExerciseFromProgram = async (exerciseId) => {
    try {
      await api.delete(`/programs/${id}/exercises`, { data: { exerciseId } });
      setExercises(exercises.filter((ex) => ex.id !== exerciseId));
    } catch (err) {
      console.error("Failed to remove exercise:", err.response?.data || err.message);
    }
  };

  // Create custom exercise
  const createCustomExercise = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/exercises/custom`, {
        ...newExercise,
        programId: id,
      });

      let addedExercise = res.data;
      if (addedExercise.Programs && addedExercise.Programs.length > 0) {
        addedExercise = {
          ...addedExercise,
          ProgramExercise: addedExercise.Programs[0].ProgramExercise,
        };
        delete addedExercise.Programs;
      }

      const updated = [...exercises, addedExercise].sort((a, b) => {
        const dayA = a.ProgramExercise?.day || 0;
        const dayB = b.ProgramExercise?.day || 0;
        if (dayA !== dayB) return dayA - dayB;
        const orderA = a.ProgramExercise?.order || 0;
        const orderB = b.ProgramExercise?.order || 0;
        return orderA - orderB;
      });

      setExercises(updated);

      setNewExercise({
        name: "",
        description: "",
        instructions: "",
        difficulty: "",
        category: "",
        bodyPart: "",
        targetMuscle: "",
        equipment: "",
        secondaryMuscles: "",
        sets: "",
        reps: "",
        duration: "",
        day: "",
        order: "",
      });
    } catch (err) {
      console.error("Failed to create custom exercise:", err.response?.data || err.message);
    }
  };

  if (!program) return <p>Loading program...</p>;

  const groupedExercises = exercises.reduce((acc, ex) => {
    const day = ex.ProgramExercise?.day || 0;
    if (!acc[day]) acc[day] = [];
    acc[day].push(ex);
    return acc;
  }, {});

  return (
    <div className="program-detail-page">
      <button className="back-btn" onClick={() => navigate("/view")}>
        ⬅ Back to My Programs
      </button>

      <h2>{program.name}</h2>
      <p>{program.description}</p>

      {/* Add Exercise Section on Top */}
      <button
        className="toggle-add-exercise"
        onClick={() => setShowAddExercise(!showAddExercise)}
      >
        {showAddExercise ? "Cancel" : "Add Exercise"}
      </button>

      {showAddExercise && (
        <div className="exercise-options">
          <h3>Search & Add Exercise</h3>
          <div className="search-section">
            <input
              type="text"
              placeholder="Search exercises..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
            >
              <option value="name">Name</option>
              <option value="equipment">Equipment</option>
              <option value="bodyPart">Body Part</option>
            </select>
            <button onClick={handleSearch}>Search</button>

            <ul>
              {noResults ? (
                <p className="no-results">No exercises found for your search and filter.</p>
              ) : (
                searchResults.map((result, idx) => (
                  <li key={result.id || `search-${idx}`}>
                    <strong>{result.name}</strong>
                    {pickedExerciseIndex === idx ? (
                      <>
                        <input
                          type="number"
                          placeholder="Sets"
                          value={result.sets}
                          onChange={(e) =>
                            setSearchResults((prev) =>
                              prev.map((r, i) =>
                                i === idx ? { ...r, sets: e.target.value } : r
                              )
                            )
                          }
                        />
                        <input
                          type="number"
                          placeholder="Reps"
                          value={result.reps}
                          onChange={(e) =>
                            setSearchResults((prev) =>
                              prev.map((r, i) =>
                                i === idx ? { ...r, reps: e.target.value } : r
                              )
                            )
                          }
                        />
                        <input
                          type="text"
                          placeholder="Duration"
                          value={result.duration}
                          onChange={(e) =>
                            setSearchResults((prev) =>
                              prev.map((r, i) =>
                                i === idx ? { ...r, duration: e.target.value } : r
                              )
                            )
                          }
                        />
                        <input
                          type="number"
                          placeholder="Day"
                          value={result.day}
                          onChange={(e) =>
                            setSearchResults((prev) =>
                              prev.map((r, i) =>
                                i === idx ? { ...r, day: e.target.value } : r
                              )
                            )
                          }
                        />
                        <input
                          type="number"
                          placeholder="Order"
                          value={result.order}
                          onChange={(e) =>
                            setSearchResults((prev) =>
                              prev.map((r, i) =>
                                i === idx ? { ...r, order: e.target.value } : r
                              )
                            )
                          }
                        />
                        <button onClick={() => addExerciseToProgram(result)}>Add</button>
                        <button onClick={() => setPickedExerciseIndex(null)}>Cancel</button>
                      </>
                    ) : (
                      <button onClick={() => setPickedExerciseIndex(idx)}>Pick</button>
                    )}
                  </li>
                ))
              )}
            </ul>
          </div>

          <h3>Create Custom Exercise</h3>
          <form onSubmit={createCustomExercise} className="custom-form">
            <input
              type="text"
              placeholder="Exercise name"
              value={newExercise.name}
              onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
              required
            />
            <textarea
              placeholder="Exercise description"
              value={newExercise.description}
              onChange={(e) => setNewExercise({ ...newExercise, description: e.target.value })}
            />
            <textarea
              placeholder="Instructions"
              value={newExercise.instructions}
              onChange={(e) => setNewExercise({ ...newExercise, instructions: e.target.value })}
            />
            <input
              type="text"
              placeholder="Difficulty"
              value={newExercise.difficulty}
              onChange={(e) => setNewExercise({ ...newExercise, difficulty: e.target.value })}
            />
            <input
              type="text"
              placeholder="Category"
              value={newExercise.category}
              onChange={(e) => setNewExercise({ ...newExercise, category: e.target.value })}
            />
            <input
              type="text"
              placeholder="Body Part"
              value={newExercise.bodyPart}
              onChange={(e) => setNewExercise({ ...newExercise, bodyPart: e.target.value })}
            />
            <input
              type="text"
              placeholder="Target Muscle"
              value={newExercise.targetMuscle}
              onChange={(e) => setNewExercise({ ...newExercise, targetMuscle: e.target.value })}
            />
            <input
              type="text"
              placeholder="Equipment"
              value={newExercise.equipment}
              onChange={(e) => setNewExercise({ ...newExercise, equipment: e.target.value })}
            />
            <input
              type="text"
              placeholder="Secondary Muscles"
              value={newExercise.secondaryMuscles}
              onChange={(e) => setNewExercise({ ...newExercise, secondaryMuscles: e.target.value })}
            />

            <input
              type="number"
              placeholder="Sets"
              value={newExercise.sets}
              onChange={(e) => setNewExercise({ ...newExercise, sets: e.target.value })}
            />
            <input
              type="number"
              placeholder="Reps"
              value={newExercise.reps}
              onChange={(e) => setNewExercise({ ...newExercise, reps: e.target.value })}
            />
            <input
              type="text"
              placeholder="Duration"
              value={newExercise.duration}
              onChange={(e) => setNewExercise({ ...newExercise, duration: e.target.value })}
            />
            <input
              type="number"
              placeholder="Day"
              value={newExercise.day}
              onChange={(e) => setNewExercise({ ...newExercise, day: e.target.value })}
            />
            <input
              type="number"
              placeholder="Order"
              value={newExercise.order}
              onChange={(e) => setNewExercise({ ...newExercise, order: e.target.value })}
            />

            <button type="submit">Create Exercise</button>
          </form>
        </div>
      )}

      {/* Exercises list */}
      <h3>Exercises in this program:</h3>
      {Object.entries(groupedExercises).map(([day, dayExercises]) => (
        <div key={day} className="day-group">
          <h4>Day {day}</h4>
          <ul>
            {dayExercises.map((ex) => (
              <li key={ex.id} className="exercise-item">
                <strong>{ex.name}</strong>
                {ex.bodyPart && <p><em>Body Part:</em> {ex.bodyPart}</p>}
                {ex.equipment && <p><em>Equipment:</em> {ex.equipment}</p>}
                {ex.targetMuscle && <p><em>Target Muscle:</em> {ex.targetMuscle}</p>}
                {ex.secondaryMuscles && <p><em>Secondary Muscles:</em> {ex.secondaryMuscles}</p>}
                {ex.difficulty && <p><em>Difficulty:</em> {ex.difficulty}</p>}
                {ex.category && <p><em>Category:</em> {ex.category}</p>}
                {ex.instructions && <p><em>Instructions:</em> {ex.instructions}</p>}
                {ex.description && <p><em>Description:</em> {ex.description}</p>}
                <div className="exercise-meta">
                  {ex.ProgramExercise?.sets && <p><em>Sets:</em> {ex.ProgramExercise.sets}</p>}
                  {ex.ProgramExercise?.reps && <p><em>Reps:</em> {ex.ProgramExercise.reps}</p>}
                  {ex.ProgramExercise?.duration && <p><em>Duration:</em> {ex.ProgramExercise.duration}</p>}
                  {ex.ProgramExercise?.order && <p><em>Order:</em> {ex.ProgramExercise.order}</p>}
                </div>
                <button
                  className="remove-exercise-btn"
                  onClick={() => removeExerciseFromProgram(ex.id)}
                >
                  ❌ Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
