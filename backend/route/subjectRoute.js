const express = require("express");
const {
  getAllSubject,
  createNewSubject,
  deleteSubject,
  filterSubjects,
} = require("../controller/subjectController");

const router = express.Router();

router.get("/", getAllSubject);
router.get("/filtersubject", filterSubjects);
router.post("/", createNewSubject);
router.delete("/:id", deleteSubject);

module.exports = router;
