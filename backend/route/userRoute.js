const express = require("express");
const {
  getUserByRole,
  createNewUser,
} = require("../controller/userController");

const router = express.Router();

router.post("/role", getUserByRole);
router.post("/", createNewUser);

module.exports = router;
