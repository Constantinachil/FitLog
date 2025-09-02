const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/stickyNoteController");
const protect = require("../middlewares/authMiddleware"); // your existing JWT middleware

router.use(protect); // everything below requires login

router.get("/", ctrl.getMyStickyNotes);
router.post("/", ctrl.createStickyNote);
router.put("/:id", ctrl.updateStickyNote);
router.delete("/:id", ctrl.deleteStickyNote);

module.exports = router;
