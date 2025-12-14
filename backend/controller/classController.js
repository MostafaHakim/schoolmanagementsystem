const Classes = require("../model/classModel");

const createNewClass = async (req, res) => {
  try {
    const createClass = new Classes(req.body);
    const saveClass = await createClass.save();
    if (!saveClass) {
      return res.status(400).json({ message: "Something Wrong", error });
    }
    res.status(201).json(saveClass);
  } catch (error) {
    console.error(error);
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

module.exports = { getAllClasses, createNewClass, deleteClass };
