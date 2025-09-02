import React, { useState, useEffect, useRef } from "react";
import Draggable from "react-draggable";
import "../styles/stickynotes.css";

export default function StickyNotes() {
  const [notes, setNotes] = useState([]);

  // Load notes from localStorage on first render
  useEffect(() => {
    const saved = localStorage.getItem("dailyNotes");
    if (saved) {
      const parsed = JSON.parse(saved);
      setNotes(
        parsed.map((note) => ({
          ...note,
          nodeRef: React.createRef() // create new ref every time
        }))
      );
    }
  }, []);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    const saveable = notes.map(({ nodeRef, ...rest }) => rest);
    localStorage.setItem("dailyNotes", JSON.stringify(saveable));
  }, [notes]);

  const addNote = () => {
    if (notes.length >= 10) {
      alert("⚠️ You can only have up to 10 goals.");
      return;
    }
    const newNote = {
      id: Date.now(),
      text: "",
      x: 350,
      y: 200,
      nodeRef: React.createRef()
    };
    setNotes((prev) => [...prev, newNote]);
  };

  const updateNote = (id, newText) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, text: newText } : n))
    );
  };

  const deleteNote = (id) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const onDragStop = (id, data) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, x: data.x, y: data.y } : n
      )
    );
  };

  return (
    <>
      <div className="widget goal-widget">
        <h4>🏋️‍♀️ Goals</h4>
        <button className="add-btn" onClick={addNote}>+ Add Goal</button>
        <p>{notes.length}/10 goals</p>
      </div>

      <div className="notes-layer">
        {notes.map((note) => (
          <Draggable
            key={note.id}
            nodeRef={note.nodeRef}   // ✅ required for React 18
            defaultPosition={{ x: note.x, y: note.y }}
            onStop={(e, data) => onDragStop(note.id, data)}
          >
            <div ref={note.nodeRef} className="note">
              <textarea
                value={note.text}
                onChange={(e) => updateNote(note.id, e.target.value)}
              />
              <button className="delete-btn" onClick={() => deleteNote(note.id)}>
                ✕
              </button>
            </div>
          </Draggable>
        ))}
      </div>
    </>
  );
}