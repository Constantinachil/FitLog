import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api"; // <-- our Axios instance with token
import "../styles/view.css";

export default function ProgramsPage() {
  const [programs, setPrograms] = useState([]);
  const [newProgram, setNewProgram] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [editingProgramId, setEditingProgramId] = useState(null);
  const [editedProgramName, setEditedProgramName] = useState("");
  const [editedProgramDescription, setEditedProgramDescription] = useState("");

  // Fetch programs from backend
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const res = await api.get("/programs");
        setPrograms(res.data);
      } catch (err) {
        console.error(
          "Error fetching programs:",
          err.response?.data || err.message
        );
      }
    };
    fetchPrograms();
  }, []);

  // Add program
  const addProgram = async (e) => {
    e.preventDefault();
    if (!newProgram.trim()) return;

    try {
      const res = await api.post("/programs", {
        name: newProgram,
        description: newDescription,
      });
      setPrograms([...programs, res.data]);
      setNewProgram("");
      setNewDescription("");
    } catch (err) {
      console.error(
        "Error adding program:",
        err.response?.data || err.message
      );
    }
  };

  // Delete program
  const deleteProgram = async (id) => {
    try {
      await api.delete(`/programs/${id}`);
      setPrograms(programs.filter((p) => p.id !== id));
    } catch (err) {
      console.error(
        "Error deleting program:",
        err.response?.data || err.message
      );
    }
  };

  // Edit helpers
  const startEditProgram = (program) => {
    setEditingProgramId(program.id);
    setEditedProgramName(program.name);
    setEditedProgramDescription(program.description || "");
  };

  const saveEditProgram = async (id) => {
    try {
      const res = await api.put(`/programs/${id}`, {
        name: editedProgramName,
        description: editedProgramDescription,
      });
      setPrograms(
        programs.map((p) => (p.id === id ? res.data.program : p))
      );
      setEditingProgramId(null);
      setEditedProgramName("");
      setEditedProgramDescription("");
    } catch (err) {
      console.error(
        "Error updating program:",
        err.response?.data || err.message
      );
    }
  };

  return (
    <div className="programs-page">
      <div className="content">
        <h2>Programs</h2>

        {/* Add Program Form */}
        <form onSubmit={addProgram} className="program-form">
          <input
            type="text"
            placeholder="New Program Name"
            value={newProgram}
            onChange={(e) => setNewProgram(e.target.value)}
          />
          <input
            type="text"
            placeholder="Program Description"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
          />
          <button type="submit">Add Program</button>
        </form>

        {/* Program List */}
        <div className="program-list">
          {programs.map((program) => (
            <div key={program.id} className="program-card">
              {editingProgramId === program.id ? (
                <div className="edit-program">
                  <input
                    type="text"
                    value={editedProgramName}
                    onChange={(e) => setEditedProgramName(e.target.value)}
                  />
                  <input
                    type="text"
                    value={editedProgramDescription}
                    onChange={(e) =>
                      setEditedProgramDescription(e.target.value)
                    }
                    placeholder="Edit description"
                  />
                  <button onClick={() => saveEditProgram(program.id)}>
                    Save
                  </button>
                  <button onClick={() => setEditingProgramId(null)}>
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <Link to={`/programs/${program.id}`} className="program-link">
                    <h3>{program.name}</h3>
                  </Link>
                  <p className="program-description">
                    {program.description}
                  </p>
                  <div className="program-actions">
                    <button onClick={() => startEditProgram(program)}>
                      Edit
                    </button>
                    <button onClick={() => deleteProgram(program.id)}>
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
