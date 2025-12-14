const Students = require("../model/studentModel");
const Exams = require("../model/examModel");
const Subjects = require("../model/subjectModel");

const createNewStudent = async (req, res) => {
  try {
    const {
      studentName,
      studentClass,
      studentSessions,
      studentRoll,
      studentGroup,
    } = req.body;
    console.log(studentSessions);
    // 🔹 1. Get subjects for this class
    const classSubjects = await Subjects.find({ subjectClass: studentClass });

    // Map subjects to exam structure (marks empty for now)
    const subjectsForExams = classSubjects.map((subj) => ({
      subjectName: subj.subjectName,
      marks: [], // empty initially
    }));

    // 🔹 2. Get exams for this session
    const examsForSession = await Exams.find({ sessionName: studentSessions });

    // Map exams with subjects
    const studentExams = examsForSession.map((exam) => ({
      examName: exam.examName,
      subjects: subjectsForExams, // attach class subjects
    }));

    // 🔹 3. Create student
    const newStudent = new Students({
      studentName,
      studentClass,
      studentSessions,
      studentRoll,
      studentGroup: studentGroup || "general",
      studentExams, // attach exams with subjects
    });

    const savedStudent = await newStudent.save();
    res.status(201).json({ success: true, student: savedStudent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const getAllStudents = async (req, res) => {
  try {
    const getStudent = await Students.find();
    res.status(200).json(getStudent);
  } catch (error) {
    console.error(error);
  }
};
const getStudentsByClassName = async (req, res) => {
  try {
    const { className } = req.params;
    const getStudent = await Students.find({ studentClass: className });
    res.status(200).json(getStudent);
  } catch (error) {
    console.error(error);
  }
};

const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedStudent = await Students.findByIdAndDelete(id);

    if (!deletedStudent) {
      return res.status(404).json({ message: "Class not found" });
    }

    res
      .status(200)
      .json({ message: "Class deleted successfully", deletedStudent });
  } catch (error) {
    console.error("Delete class error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ===============================================

const updateBatchMarks = async (req, res) => {
  try {
    const { studentClass, examName, subjectName, marksList } = req.body;

    if (!studentClass || !examName || !subjectName || !marksList?.length) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const results = [];

    for (const { studentRoll, gotMarks } of marksList) {
      const student = await Students.findOne({
        studentClass,
        studentRoll,
      });

      if (!student) {
        results.push({ studentRoll, status: "Student not found" });
        continue;
      }

      const exam = student.studentExams.find((e) => e.examName === examName);

      if (!exam) {
        results.push({ studentRoll, status: "Exam not found" });
        continue;
      }

      const subject = exam.subjects.find((s) => s.subjectName === subjectName);

      if (!subject) {
        results.push({ studentRoll, status: "Subject not found" });
        continue;
      }

      // ✅ ONLY UPDATE MARKS
      subject.marks = {
        passMark: 33,
        gotMarks: Number(gotMarks),
      };

      await student.save();

      results.push({
        studentRoll,
        status: "Marks updated",
      });
    }

    res.json({
      message: "Marks updated successfully",
      results,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getExistingMarks = async (req, res) => {
  try {
    const { studentClass, examName, subjectName } = req.query;

    if (!studentClass || !examName || !subjectName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const students = await Students.find({ studentClass });

    const marksMap = {};
    // { roll: gotMarks }

    students.forEach((student) => {
      const exam = student.studentExams.find((e) => e.examName === examName);

      if (!exam) return;

      const subject = exam.subjects.find((s) => s.subjectName === subjectName);

      if (!subject || !subject.marks) return;

      marksMap[student.studentRoll] = subject.marks.gotMarks;
    });

    res.json(marksMap);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllStudents,
  createNewStudent,
  deleteStudent,
  getStudentsByClassName,
  updateBatchMarks,
  getExistingMarks,
};
