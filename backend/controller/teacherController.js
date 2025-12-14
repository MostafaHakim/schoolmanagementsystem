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

module.exports = { getAllTeacher, createNewTeacher };
