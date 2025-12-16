const express = require("express");
const {
  getAllSetting,
  createNewSetting,
} = require("../controller/settingsController");

const router = express.Router();

router.get("/", getAllSetting);
router.post("/", createNewSetting);

module.exports = router;
