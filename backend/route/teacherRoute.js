const express = require("express");
const {
  getAllTeacher,
  createNewTeacher,
  deleteTeacher,
} = require("../controller/teacherController");

const router = express.Router();

router.get("/", getAllTeacher);
router.post("/", createNewTeacher);
router.delete("/:id", deleteTeacher);

module.exports = router;
