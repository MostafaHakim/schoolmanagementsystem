const Exams = require("../model/examModel");
const Session = require("../model/sessionModel");

const createNewExams = async (req, res) => {
  try {
    const { examName, sessionName, startDate, endDate } = req.body;

    const exists = await Exams.findOne({
      examName,
      sessionName,
      "examDate.startDate": startDate,
      "examDate.endDate": endDate,
    });

    if (exists) {
      return res.status(409).json({
        success: false,
        message: "Exam already exists in current session",
      });
    }

    const createExam = await Exams.create({
      examName,
      sessionName,
      examDate: { startDate, endDate },
    });

    res.status(201).json({
      success: true,
      data: createExam,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getAllExams = async (req, res) => {
  try {
    const { sessionName } = req.query;
    const getExams = await Exams.find({ sessionName });
    res.status(200).json(getExams);
  } catch (error) {
    console.error(error);
  }
};

const deleteExam = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedExams = await Exams.findByIdAndDelete(id);

    if (!deletedExams) {
      return res.status(404).json({ message: "Class not found" });
    }

    res
      .status(200)
      .json({ message: "Class deleted successfully", deletedExams });
  } catch (error) {
    console.error("Delete class error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getExams = async (req, res) => {
  try {
    const { sessionName } = req.query; // query থেকে sessionName নাও
    const filter = sessionName ? { sessionName } : {};
    const exams = await Exams.find(filter);
    res.json(exams);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAllExams, createNewExams, deleteExam, getExams };
