const express = require("express");
const router = express.Router();

const {
  createEvent,
  getEvents,
  getSummary,
} = require("../controllers/eventsController");

router.post("/", createEvent);

router.get("/", getEvents);

router.get("/summary", getSummary);

module.exports = router;