import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import "../styles/view.css";

// ✅ Toastify imports
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function View() {
  console.log("✅ View.jsx rendered");
  const [programs, setPrograms] = useState([]);
  const [newProgram, setNewProgram] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [editingProgramId, setEditingProgramId] = useState(null);
  const [editedProgramName, setEditedProgramName] = useState("");
  const [editedProgramDescription, setEditedProgramDescription] = useState("");

  // Fetch all programs on load
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

  // Add a program
  const addProgram = async (e) => {
    e.preventDefault();
    if (!newProgram.trim()) return;

    try {
      const res = await api.post("/programs", {
        name: newProgram,
        description: newDescription,
      });

      // ✅ use res.data.program not res.data
      setPrograms([...programs, res.data.program]);

      setNewProgram("");
      setNewDescription("");

      // ✅ Show achievement notifications
      if (res.data.achievementsUnlocked?.length > 0) {
        res.data.achievementsUnlocked.forEach((ach) =>
          toast.success(`🏆 Achievement unlocked: ${ach}!`)
        );
      }
    } catch (err) {
      console.error("Error adding program:", err.response?.data || err.message);
    }
  };

  // Delete a program
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

  // Start editing
  const startEditProgram = (program) => {
    setEditingProgramId(program.id);
    setEditedProgramName(program.name);
    setEditedProgramDescription(program.description || "");
  };

  // Save edit
  const saveEditProgram = async (id) => {
    try {
      const res = await api.put(`/programs/${id}`, {
        name: editedProgramName,
        description: editedProgramDescription,
      });

      // ✅ use res.data.program consistently
      setPrograms(programs.map((p) => (p.id === id ? res.data.program : p)));

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
        <h1 className="page-title">Programs</h1>

        <form onSubmit={addProgram} className="program-form">
          <input
            type="text"
            placeholder="New Program Name"
            value={newProgram}
            onChange={(e) => setNewProgram(e.target.value)}
          />
          <textarea
            placeholder="Program Description"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            rows={3}
          />
          <button type="submit">Add Program</button>
        </form>

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
                  <textarea
                    value={editedProgramDescription}
                    onChange={(e) =>
                      setEditedProgramDescription(e.target.value)
                    }
                    rows={3}
                    placeholder="Edit description"
                  />
                  <div className="edit-buttons">
                    <button onClick={() => saveEditProgram(program.id)}>
                      Save
                    </button>
                    <button onClick={() => setEditingProgramId(null)}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="program-view" key={`${program.id}-view`}>
                  <Link to={`/programs/${program.id}`} className="program-link">
                    <h3>{program.name}</h3>
                  </Link>
                  <p className="program-description">{program.description}</p>
                  <div className="program-actions">
                    <button onClick={() => startEditProgram(program)}>
                      Edit
                    </button>
                    <button onClick={() => deleteProgram(program.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ✅ Toast notifications container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
