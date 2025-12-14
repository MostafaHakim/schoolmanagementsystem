const express = require("express");
const {
  getAllClasses,
  createNewClass,
  deleteClass,
  getAllClassesBySession,
} = require("../controller/classController");
const router = express.Router();

router.get("/", getAllClasses);
router.get("/:sessionName", getAllClassesBySession);
router.post("/", createNewClass);
router.delete("/:id", deleteClass);

module.exports = router;
