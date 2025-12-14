const express = require("express");
const { addMarks, getMarksheet, getClassMarksheets } = require("../controller/marksheetController");

const router = express.Router();

router.post("/", addMarks);
router.get("/", getMarksheet);
router.get("/class", getClassMarksheets);

module.exports = router;
