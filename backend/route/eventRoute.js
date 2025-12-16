// routes/eventRoutes.js
const express = require("express");
const router = express.Router();
const {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getEventsByType,
  getEventsByDateRange,
  searchEvents,
} = require("../controller/eventController");

router.post("/", createEvent);

router.get("/:sessionName", getAllEvents);

router.get("/search", searchEvents);

router.get("/range", getEventsByDateRange);

router.get("/type/:type", getEventsByType);

router.get("/:id", getEventById);

router.put("/:id", updateEvent);

router.delete("/:id", deleteEvent);

module.exports = router;
