const express = require("express");
const router = express.Router();

const {
  createEvent,
  getEvents,
  getSummary,
  deleteEvent,
} = require("../controllers/eventsController");

const auth = require("../middleware/authMiddleware");

// Require authentication for events endpoints
router.post("/", auth, createEvent);

router.get("/", auth, getEvents);

router.get("/summary", auth, getSummary);

// Delete an event (only owner)
router.delete("/:id", auth, deleteEvent);

module.exports = router;