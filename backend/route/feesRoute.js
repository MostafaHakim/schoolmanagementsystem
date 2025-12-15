const express = require("express");
const router = express.Router();

const {
  createFee,
  getAllFees,
  deleteFees,
} = require("../controller/feesController");

router.post("/", createFee);
router.get("/", getAllFees);
router.delete("/:id", deleteFees);

module.exports = router;
