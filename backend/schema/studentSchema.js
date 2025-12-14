const mongoose = require("mongoose");

// Subject Schema (exam এর subject list)
const subjectSchema = new mongoose.Schema({
  subjectName: { type: String, required: true },
  marks: {
    passMark: Number,
    gotMarks: Number,
  },
  // array of marks
});

// Exam Schema (student এর exams)
const studentExamSchema = new mongoose.Schema({
  examName: { type: String, required: true },
  subjects: [subjectSchema], // array of subjects
});

// Main Student Schema
const studentSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  studentSessions: { type: String, required: true },
  studentClass: { type: String, required: true },
  studentRoll: { type: Number, required: true },
  studentExams: [studentExamSchema], // array of exams
  studentGroup: { type: String, default: "general" },
});

module.exports = studentSchema;
