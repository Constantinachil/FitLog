import React, { useState, useEffect } from "react";
import "../styles/view.css";

export default function ProgramsPage() {
  const [programs, setPrograms] = useState(() => {
    const saved = localStorage.getItem("programs");
    return saved ? JSON.parse(saved) : [];
  });

  const [newProgram, setNewProgram] = useState("");

  useEffect(() => {
    localStorage.setItem("programs", JSON.stringify(programs));
  }, [programs]);

  const addProgram = (e) => {
    e.preventDefault();
    if (!newProgram.trim()) return;
    const newEntry = { id: Date.now(), name: newProgram };
    setPrograms([...programs, newEntry]);
    setNewProgram("");
  };

  const deleteProgram = (id) => {
    setPrograms(programs.filter((p) => p.id !== id));
  };

  return (
    <div className="programs-page">
      <div className="programs-container">
        <h2 className="programs-title">🏋️ Manage Your Programs</h2>

        <form onSubmit={addProgram} className="program-form">
          <input
            type="text"
            value={newProgram}
            onChange={(e) => setNewProgram(e.target.value)}
            placeholder="Enter program name"
          />
          <button type="submit">+ Add Program</button>
        </form>

        <div className="programs-list">
          {programs.length === 0 ? (
            <p className="empty-msg">No programs yet. Start by adding one! 💪</p>
          ) : (
            <ul>
              {programs.map((program) => (
                <li key={program.id} className="program-item">
                  <span>{program.name}</span>
                  <button
                    className="delete-btn"
                    onClick={() => deleteProgram(program.id)}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
