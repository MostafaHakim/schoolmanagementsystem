const mongoose = require("mongoose");

const feesSchema = new mongoose.Schema({
  feesName: { type: String, required: true },
  feesAmount: { type: String, required: true },
  feesClass: { type: String, required: true },
});

module.exports = feesSchema;
