const Session = require("../model/sessionModel");
const Exams = require("../model/examModel");
const Classes = require("../model/classModel");
const Events = require("../model/eventModal");

const startNewSession = async (req, res) => {
  try {
    const { sessionName } = req.body;
    const sessionExists = await Session.findOne({ sessionName });
    if (sessionExists) {
      return res.status(400).json({
        success: false,
        message: "Session already exists",
      });
    }

    const prevSession = (Number(sessionName) - 1).toString();

    const oldExams = await Exams.find({ sessionName: prevSession });
    if (oldExams.length > 0) {
      const newExams = oldExams.map((e) => ({
        examName: e.examName,
        sessionName,
        examDate: {
          startDate: e.examDate.startDate,
          endDate: e.examDate.endDate,
        },
        status: "Upcoming",
      }));
      await Exams.insertMany(newExams);
    }
    const oldClasses = await Classes.find({ sessionName: prevSession });
    if (oldClasses.length > 0) {
      const newClasses = oldClasses.map((c) => ({
        className: c.className,
        sessionName,
      }));
      await Classes.insertMany(newClasses);
    }

    const oldEvents = await Events.find({ eventSession: prevSession });
    console.log(oldEvents);
    if (oldEvents.length > 0) {
      const newEvents = oldEvents.map((e) => ({
        eventSession: sessionName,
        title: e.title,
        startDate: e.startDate,
        endDate: e.endDate,
        type: e.type,
      }));
      await Events.insertMany(newEvents);
    }
    await Session.create({ sessionName });
    res.json({
      success: true,
      message: "New Academic Session Started Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
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
