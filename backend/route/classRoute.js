const express = require("express");
const {
  getAllClasses,
  createNewClass,
  deleteClass,
} = require("../controller/classController");
const router = express.Router();

router.get("/", getAllClasses);
router.post("/", createNewClass);
router.delete("/:id", deleteClass);

module.exports = router;
