const mongoose = require("mongoose");
const examSchema = mongoose.Schema({
  examName: String,
  sessionName: String,
  examDate: {
    startDate: Date,
    endDate: Date,
  },
  status: {
    type: String,
    enum: ["Upcoming", "Completed"],
    default: "Upcoming",
  },
});

module.exports = examSchema;
