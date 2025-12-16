const express = require("express");
const {
  getAllStudents,
  createNewStudent,
  deleteStudent,
  getStudentsByClassName,
  updateBatchMarks,
  getExistingMarks,
  getStudentsById,
  updatePayment,
  promoteMultipleStudents,
  getAllStudentsBySessionName,
} = require("../controller/studentController");

const router = express.Router();

router.get("/", getAllStudents);
router.get("/existing-marks", getExistingMarks);
router.get("/:className", getStudentsByClassName);
router.get("/allstudents/:sessionName", getAllStudentsBySessionName);
router.get("/profile/:id", getStudentsById);
router.post("/", createNewStudent);
router.post("/markentry", updateBatchMarks);
router.post("/promote", promoteMultipleStudents);
router.delete("/:id", deleteStudent);
router.put("/fees/pay/:studentId/:feeId", updatePayment);

module.exports = router;
