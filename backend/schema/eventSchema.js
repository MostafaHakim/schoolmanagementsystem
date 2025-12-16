const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    eventSession: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    type: {
      type: String,
      required: true,
      enum: ["Exam", "Holiday", "Program", "Meeting"],
    },

    totalDays: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);
module.exports = eventSchema;
