const { StickyNote } = require("../models");

// GET /api/stickynotes
exports.getMyStickyNotes = async (req, res) => {
  try {
    const userId = req.user.id;
    const notes = await StickyNote.findAll({
      where: { userId },
      order: [["updatedAt", "DESC"]],
    });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/stickynotes
exports.createStickyNote = async (req, res) => {
  try {
    const userId = req.user.id;
    const { content } = req.body;

    const count = await StickyNote.count({ where: { userId } });
    if (count >= 10) {
      return res.status(400).json({ error: "Max 10 sticky notes allowed." });
    }

    const note = await StickyNote.create({ content, userId });
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/stickynotes/:id
exports.updateStickyNote = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { content } = req.body;

    const note = await StickyNote.findOne({ where: { id, userId } });
    if (!note) return res.status(404).json({ error: "Note not found." });

    note.content = content;
    await note.save();
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/stickynotes/:id
exports.deleteStickyNote = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const deleted = await StickyNote.destroy({ where: { id, userId } });
    if (!deleted) return res.status(404).json({ error: "Note not found." });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
