// controllers/sessionController.js
const Session = require("../model/sessionModel");
// const FeeStructure = require("../models/FeeStructure");
const Exams = require("../model/examModel");

const startNewSession = async (req, res) => {
  try {
    const { sessionName } = req.body;

    // 🔹 Step 1: Session already exists?
    const sessionExists = await Session.findOne({ sessionName });
    if (sessionExists) {
      return res.status(400).json({
        success: false,
        message: "Session already exists",
      });
    }

    // 🔹 Step 2: Create new session
    await Session.create({ sessionName });

    // 🔹 Step 3: Check if exam already exists for this session
    const alreadyExam = await Exams.findOne({ sessionName });
    if (alreadyExam) {
      return res.json({
        success: true,
        message: "Session created, exams already exist",
      });
    }

    const prevSession = (Number(sessionName) - 1).toString();
    const oldExam = await Exams.find({ sessionName: prevSession });

    const newExam = oldExam.map((e) => ({
      examName: e.examName,
      sessionName: sessionName,
    }));

    await Exams.insertMany(newExam);

    res.json({
      success: true,
      message: "New Academic Session Started Successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllSession = async (req, res) => {
  try {
    const getSession = await Session.find();
    if (!getSession) {
      res.status(404).json({ massage: "not found" });
    }
    res.status(200).json(getSession);
  } catch (error) {
    console.error(error);
  }
};

const currentSession = async (req, res) => {
  try {
    const lastSession = await Session.findOne().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: lastSession.sessionName,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { startNewSession, getAllSession, currentSession };
