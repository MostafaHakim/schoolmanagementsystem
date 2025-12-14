const mongoose = require("mongoose");

const marksheetSchema = new mongoose.Schema(
  {
    examName: {
      type: String,
      required: true,
    },
    studentClass: {
      type: String,
      required: true,
    },
    studentRoll: {
      type: String,
      required: true,
    },
    studentName: {
        type: String,
        required: true,
    },
    marks: [
      {
        subjectName: String,
        marksObtained: String,
        totalMarks: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = marksheetSchema;
