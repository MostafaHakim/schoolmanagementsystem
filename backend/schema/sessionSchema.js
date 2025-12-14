const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    sessionName: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = sessionSchema;
