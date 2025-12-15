const mongoose = require("mongoose");

// Subject Schema (exam এর subject list)
const subjectSchema = new mongoose.Schema({
  subjectName: { type: String, required: true },
  marks: {
    totalMark: Number,
    passMark: Number,
    gotMarks: Number,
  },
  // array of marks
});

// Exam Schema (student এর exams)
const studentExamSchema = new mongoose.Schema({
  examName: { type: String, required: true },
  sessionName: { type: String, required: true },
  subjects: [subjectSchema], // array of subjects
});
const allFees = new mongoose.Schema({
  feesName: { type: String, required: true },
  feeAmount: { type: String, required: true },

  status: {
    type: String,
    enum: ["due", "paid"],
    default: "due",
  },

  paidDate: {
    type: Date,
    default: null,
  },

  receiptNo: {
    type: String,
    default: null,
  },
});

// Main Student Schema
const studentSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  studentSessions: { type: String, required: true },
  studentClass: { type: String, required: true },
  studentRoll: { type: Number, required: true },
  studentFees: [allFees],
  studentExams: [studentExamSchema], // array of exams
  studentGroup: { type: String, default: "general" },
});

studentSchema.index(
  { studentClass: 1, studentSessions: 1, studentRoll: 1 },
  { unique: true }
);
module.exports = studentSchema;
