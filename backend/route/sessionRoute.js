const express = require("express");
const {
  getAllSession,
  startNewSession,
  currentSession,
} = require("../controller/sessionController");

const router = express.Router();

router.get("/", getAllSession);
router.get("/currentsession", currentSession);
router.post("/", startNewSession);

module.exports = router;
