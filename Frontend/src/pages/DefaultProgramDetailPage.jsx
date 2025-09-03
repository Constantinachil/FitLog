import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/defaultProgramDetail.css";



export default function DefaultProgramDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [program, setProgram] = useState(null);

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        const res = await axios.get(`/api/default-programs/${id}/details`);
        setProgram(res.data);
      } catch (err) {
        console.error("Error fetching program details:", err);
      }
    };
    fetchProgram();
  }, [id]);

  if (!program) return <p>Loading...</p>;

  // Group exercises by day and sort by order
  const groupedByDay = program.Exercises.reduce((groups, ex) => {
    const day = ex.DefaultProgramExercise.day || 0;
    if (!groups[day]) groups[day] = [];
    groups[day].push(ex);
    return groups;
  }, {});

  Object.keys(groupedByDay).forEach((day) => {
    groupedByDay[day].sort(
      (a, b) =>
        (a.DefaultProgramExercise.order || 0) -
        (b.DefaultProgramExercise.order || 0)
    );
  });

  return (
    <div className="program-detail-page">
      <button onClick={() => navigate("/default-programs")}>
  ⬅ Back to Programs
</button>
      <h2>{program.name}</h2>
      <p>{program.description}</p>
      <h3>Exercises</h3>

      {Object.keys(groupedByDay).length > 0 ? (
        Object.entries(groupedByDay).map(([day, exercises]) => (
          <div key={day} className="day-group">
            <h4>Day {day}</h4>
            <ul>
              {exercises.map((ex, i) => {
                const dp = ex.DefaultProgramExercise;
                return (
                  <li key={i} className="exercise-card">
                    <h5>{ex.name}</h5>
                    <ul>
                      {ex.targetMuscle && (
                        <li>
                          <strong>Target:</strong> {ex.targetMuscle}
                        </li>
                      )}
                      {ex.secondaryMuscles && (
                        <li>
                          <strong>Secondary:</strong> {ex.secondaryMuscles}
                        </li>
                      )}
                      {ex.equipment && (
                        <li>
                          <strong>Equipment:</strong> {ex.equipment}
                        </li>
                      )}
                      {ex.bodyPart && (
                        <li>
                          <strong>Body Part:</strong> {ex.bodyPart}
                        </li>
                      )}
                      {ex.description && (
                        <li>
                          <strong>Description:</strong> {ex.description}
                        </li>
                      )}
                      {ex.difficulty && (
                        <li>
                          <strong>Difficulty:</strong> {ex.difficulty}
                        </li>
                      )}
                      {ex.category && (
                        <li>
                          <strong>Category:</strong> {ex.category}
                        </li>
                      )}
                      {ex.instructions && (
                        <li>
                          <strong>Instructions:</strong>
                          <pre>{ex.instructions}</pre>
                        </li>
                      )}
                      {dp.sets && (
                        <li>
                          <strong>Sets:</strong> {dp.sets}
                        </li>
                      )}
                      {dp.reps && (
                        <li>
                          <strong>Reps:</strong> {dp.reps}
                        </li>
                      )}
                      {dp.duration && (
                        <li>
                          <strong>Duration:</strong> {dp.duration}
                        </li>
                      )}
                    </ul>
                  </li>
                );
              })}
            </ul>
          </div>
        ))
      ) : (
        <p>No exercises linked yet.</p>
      )}
    </div>
  );
}
