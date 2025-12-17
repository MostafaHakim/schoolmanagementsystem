const Classes = require("../model/classModel");

const createNewClass = async (req, res) => {
  try {
    const { className } = req.body;
    const { sessionName } = req.query;
    const isExist = await Classes.findOne({ sessionName, className });
    if (isExist) {
      return res.status(400).json({
        message: "Class Already exist",
      });
    }
    const createClass = new Classes({ sessionName, className });
    const saveClass = await createClass.save();
    if (!saveClass) {
      return res.status(400).json({ message: "Something Wrong", error });
    }
    res.status(201).json({
      message: "Class Created",
      data: saveClass,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

const getAllClasses = async (req, res) => {
  try {
    const getClass = await Classes.find();
    if (!getClass) {
      res.status(404).json({ massage: "not found" });
    }
    res.status(200).json(getClass);
  } catch (error) {
    console.error(error);
  }
};

const getAllClassesBySession = async (req, res) => {
  try {
    const { sessionName } = req.params;
    const getClass = await Classes.find({ sessionName });
    if (!getClass) {
      res.status(404).json({ massage: "not found" });
    }
    res.status(200).json(getClass);
  } catch (error) {
    console.error(error);
  }
};

const deleteClass = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedClass = await Classes.findByIdAndDelete(id);

    if (!deletedClass) {
      return res.status(404).json({ message: "Class not found" });
    }

    res
      .status(200)
      .json({ message: "Class deleted successfully", deletedClass });
  } catch (error) {
    console.error("Delete class error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllClasses,
  createNewClass,
  deleteClass,
  getAllClassesBySession,
};
