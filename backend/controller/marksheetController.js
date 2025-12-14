const Marksheet = require("../model/marksheetModel");

const addMarks = async (req, res) => {
  try {
    const { examName, studentClass, studentRoll, studentName, marks } = req.body;
    const marksheet = await Marksheet.findOneAndUpdate(
      { examName, studentClass, studentRoll },
      { studentName, marks },
      { new: true, upsert: true }
    );
    res.status(200).json(marksheet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMarksheet = async (req, res) => {
  try {
    const { examName, studentClass, studentRoll } = req.query;
    const marksheet = await Marksheet.findOne({ examName, studentClass, studentRoll });
    if (!marksheet) {
      return res.status(404).json({ message: "Marksheet not found" });
    }
    res.status(200).json(marksheet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getClassMarksheets = async (req, res) => {
  try {
    const { examName, studentClass } = req.query;
    const marksheets = await Marksheet.find({ examName, studentClass });
    res.status(200).json(marksheets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = { addMarks, getMarksheet, getClassMarksheets };
