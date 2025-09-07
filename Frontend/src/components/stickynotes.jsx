import React, { useState, useEffect } from "react";
import Draggable from "react-draggable";
import "../styles/stickynotes.css";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function StickyNotes() {
  const [notes, setNotes] = useState([]);
  const token = localStorage.getItem("token"); // JWT

  const api = axios.create({
    baseURL: "http://localhost:5000/api/stickynotes", // adjust to backend
    headers: { Authorization: `Bearer ${token}` },
  });

  // Load notes
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await api.get("/");
        setNotes(
          res.data.map((note) => ({
            ...note,
            text: note.content,
            nodeRef: React.createRef(),
          }))
        );
      } catch (err) {
        console.error("❌ Error fetching notes:", err);
        toast.error("❌ Failed to load sticky notes");
      }
    };
    fetchNotes();
  }, []);

  const addNote = async () => {
    if (notes.length >= 10) {
      toast.warning("⚠️ You can only have up to 10 notes.");
      return;
    }
    try {
      const res = await api.post("/", { content: "" });
      setNotes((prev) => [
        ...prev,
        {
          ...res.data.note,
          text: res.data.note.content,
          nodeRef: React.createRef(),
        },
      ]);

      // 🎉 Achievement toasts
      if (res.data.achievementsUnlocked?.length > 0) {
        res.data.achievementsUnlocked.forEach((ach) => {
          toast.success(`🎉 Achievement unlocked: ${ach}`);
        });
      }
    } catch (err) {
      console.error("❌ Error adding note:", err);
      toast.error("❌ Failed to add note");
    }
  };

  const saveNote = async (id, updated) => {
    try {
      await api.put(`/${id}`, updated);
    } catch (err) {
      console.error("❌ Error saving note:", err);
      toast.error("❌ Failed to save note");
    }
  };

  const updateNoteText = (id, newText) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, text: newText } : n))
    );
  };

  const deleteNote = async (id) => {
    try {
      await api.delete(`/${id}`);
      setNotes((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error("❌ Error deleting note:", err);
      toast.error("❌ Failed to delete note");
    }
  };

  const onDragStop = (id, data) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, x: data.x, y: data.y } : n))
    );
    saveNote(id, { x: data.x, y: data.y });
  };

  return (
    <>
      <div className="widget goal-widget">
        <h4>📝 Goals</h4>
        <button className="add-btn" onClick={addNote}>
          + Add Note
        </button>
        <p>{notes.length}/10 notes</p>
      </div>

      <div className="notes-layer">
        {notes.map((note) => (
          <Draggable
            key={note.id}
            nodeRef={note.nodeRef}
            defaultPosition={{ x: note.x || 100, y: note.y || 100 }}
            onStop={(e, data) => onDragStop(note.id, data)}
          >
            <div ref={note.nodeRef} className="note">
              <textarea
                value={note.text}
                onChange={(e) => updateNoteText(note.id, e.target.value)}
                onBlur={(e) =>
                  saveNote(note.id, {
                    content: e.target.value,
                    x: note.x,
                    y: note.y,
                  })
                }
              />
              <button
                className="delete-btn"
                onClick={() => deleteNote(note.id)}
              >
                ✕
              </button>
            </div>
          </Draggable>
        ))}
      </div>
    </>
  );
}
