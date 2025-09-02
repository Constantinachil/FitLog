import React, { useState, useEffect } from "react";
import "../styles/view.css";

export default function ProgramsPage() {
  const [programs, setPrograms] = useState(() => {
    const saved = localStorage.getItem("programs");
    return saved ? JSON.parse(saved) : [];
  });

  const [newProgram, setNewProgram] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editedName, setEditedName] = useState("");

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

  const startEditing = (program) => {
    setEditingId(program.id);
    setEditedName(program.name);
  };

  const saveEdit = (id) => {
    setPrograms(
      programs.map((p) =>
        p.id === id ? { ...p, name: editedName } : p
      )
    );
    setEditingId(null);
    setEditedName("");
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
                  {editingId === program.id ? (
                    <>
                      <input
                        type="text"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        className="edit-input"
                      />
                      <button
                        className="save-btn"
                        onClick={() => saveEdit(program.id)}
                      >
                        💾
                      </button>
                      <button
                        className="cancel-btn"
                        onClick={() => setEditingId(null)}
                      >
                        ❌
                      </button>
                    </>
                  ) : (
                    <>
                      <span>{program.name}</span>
                      <div className="actions">
                        <button className="edit-btn" onClick={() => startEditing(program)}> ✎ </button>

                        <button className="delete-btn" onClick={() => deleteProgram(program.id)}> ✕ </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}