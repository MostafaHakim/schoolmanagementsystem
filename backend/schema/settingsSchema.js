const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    schoolName: { type: String, required: true },
    schoolEin: { type: String, required: true },
    schoolAddress: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = settingsSchema;
