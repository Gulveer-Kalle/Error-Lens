const express = require("express");
const router = express.Router();

const {
  createEvent,
  getEvents,
  getSummary,
} = require("../controllers/eventsController");

const auth = require("../middleware/authMiddleware");

// Require authentication for events endpoints
router.post("/", auth, createEvent);

router.get("/", auth, getEvents);

router.get("/summary", auth, getSummary);

module.exports = router;