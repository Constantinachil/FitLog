const { StickyNote } = require("../models");
const { checkProgressAndAward } = require("../services/achievementService");

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
    console.error("❌ Error fetching notes:", err);
    res.status(500).json({ error: err.message });
  }
};

// POST /api/stickynotes
exports.createStickyNote = async (req, res) => {
  try {
    const userId = req.user.id;
    const { content, x, y } = req.body;

    const count = await StickyNote.count({ where: { userId } });
    if (count >= 10) {
      return res.status(400).json({ error: "Max 10 sticky notes allowed." });
    }

    const note = await StickyNote.create({
      content: content || "", // allow empty
      x: x ?? 100,
      y: y ?? 100,
      userId,
    });

    const result = await checkProgressAndAward(userId, "sticky_notes_used");

    return res.status(201).json({
      note,
      achievementsUnlocked: result.newlyUnlocked,
    });
 
  } catch (err) {
    console.error("❌ Error creating note:", err);
    res.status(500).json({ error: err.message });
  }
};


// PUT /api/stickynotes/:id
exports.updateStickyNote = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { content, x, y } = req.body;

    const note = await StickyNote.findOne({ where: { id, userId } });
    if (!note) return res.status(404).json({ error: "Note not found." });

    // update only provided fields
    if (content !== undefined) note.content = content;
    if (x !== undefined) note.x = x;
    if (y !== undefined) note.y = y;

    await note.save();
    res.json(note);
  } catch (err) {
    console.error("❌ Error updating note:", err);
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
    console.error("❌ Error deleting note:", err);
    res.status(500).json({ error: err.message });
  }
};