const express = require("express");
const {
  getAllTeacher,
  createNewTeacher,
} = require("../controller/teacherController");

const router = express.Router();

router.get("/", getAllTeacher);
router.post("/", createNewTeacher);

module.exports = router;
