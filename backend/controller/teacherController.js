const Teacher = require("../model/teacherModel");

const createNewTeacher = async (req, res) => {
  try {
    const createTeacher = new Teacher(req.body);
    const saveTeacher = await createTeacher.save();
    if (!saveTeacher) {
      return res.status(400).json({ message: "Something Wrong", error });
    }
    res.status(201).json(saveTeacher);
  } catch (error) {
    console.error(error);
  }
};

const getAllTeacher = async (req, res) => {
  try {
    const getTeacher = await Teacher.find();
    res.status(200).json(getTeacher);
  } catch (error) {
    console.error(error);
  }
};

const deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTeacher = await Teacher.findByIdAndDelete(id);
    if (!deletedTeacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    res.status(200).json({ message: "Teacher deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { getAllTeacher, createNewTeacher, deleteTeacher };
