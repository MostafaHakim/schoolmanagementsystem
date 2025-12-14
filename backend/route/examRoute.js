const express = require("express");
const {
  getAllExams,
  createNewExams,
  deleteExam,
  getExams,
} = require("../controller/examController");

const router = express.Router();

router.get("/", getAllExams);
router.get("/filter", getExams);
router.post("/", createNewExams);
router.delete("/:id", deleteExam);

module.exports = router;
