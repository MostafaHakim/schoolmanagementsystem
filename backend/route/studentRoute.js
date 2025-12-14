const express = require("express");
const {
  getAllStudents,
  createNewStudent,
  deleteStudent,
  getStudentsByClassName,
  updateBatchMarks,
  getExistingMarks,
} = require("../controller/studentController");

const router = express.Router();

router.get("/", getAllStudents);
router.get("/existing-marks", getExistingMarks);
router.get("/:className", getStudentsByClassName);
router.post("/", createNewStudent);
router.post("/markentry", updateBatchMarks);
router.delete("/:id", deleteStudent);

module.exports = router;
