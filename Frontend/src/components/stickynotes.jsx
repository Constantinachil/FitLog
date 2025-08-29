import React, { useState, useEffect } from "react";
import Draggable from "react-draggable";
import "../styles/stickynotes.css";

export default function StickyNotes() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("dailyNotes")) || [];
    const withRefs = saved.map((note) => ({ ...note, nodeRef: React.createRef() }));
    setNotes(withRefs);
  }, []);

  useEffect(() => {
    const saveable = notes.map(({ nodeRef, ...rest }) => rest);
    localStorage.setItem("dailyNotes", JSON.stringify(saveable));
  }, [notes]);

  const addNote = () => {
    if (notes.length >= 10) {
      alert("⚠️ You can only have up to 10 goals.");
      return;
    }

    setNotes([
      ...notes,
      {
        id: Date.now(),
        text: "    ",
        x: 75,
        y: 810,
        nodeRef: React.createRef(),
      },
    ]);
  };

  const updateNote = (id, newText) => {
    setNotes(notes.map((note) => (note.id === id ? { ...note, text: newText } : note)));
  };

  const deleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const onDragStop = (id, data) => {
    setNotes(
      notes.map((note) =>
        note.id === id ? { ...note, x: data.x, y: data.y } : note
      )
    );
  };

  return (
    <>
     
      <div className="widget goal-widget">
        <h4>🏋️‍♀️ Goals</h4>
        <button className="add-btn" onClick={addNote}>
          + 
        </button>
        <p style={{ fontSize: "0.8rem", color: "#666" }}>
          {notes.length}/10 goals
        </p>
      </div>

     
      <div className="notes-layer">
        {notes.map((note) => (
          <Draggable
            key={note.id}
            nodeRef={note.nodeRef}
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