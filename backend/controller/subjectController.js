const Subjects = require("../model/subjectModel");

const createNewSubject = async (req, res) => {
  try {
    const { subjectName, subjectClasses, subjectType } = req.body;

    if (!subjectClasses || subjectClasses.length === 0) {
      return res.status(400).json({
        message: "Please select at least one class",
      });
    }

    const createdSubjects = [];
    const skippedClasses = [];

    for (let cls of subjectClasses) {
      const exist = await Subjects.findOne({
        subjectName,
        subjectClass: cls,
      });

      if (exist) {
        skippedClasses.push(cls);
        continue;
      }

      const subject = new Subjects({
        subjectName,
        subjectClass: cls,
        subjectType,
      });

      const saved = await subject.save();
      createdSubjects.push(saved);
    }

    res.status(201).json({
      message: "Subject added successfully",
      createdCount: createdSubjects.length,
      skippedClasses,
      data: createdSubjects,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllSubject = async (req, res) => {
  try {
    const getSubject = await Subjects.find();
    res.status(200).json(getSubject);
  } catch (error) {
    console.error(error);
  }
};

const deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedSubject = await Subjects.findByIdAndDelete(id);

    if (!deletedSubject) {
      return res.status(404).json({ message: "Class not found" });
    }

    res
      .status(200)
      .json({ message: "Class deleted successfully", deletedSubject });
  } catch (error) {
    console.error("Delete class error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const filterSubjects = async (req, res) => {
  try {
    const { subjectClass } = req.query;
    const filter = subjectClass ? { subjectClass } : {};
    const subjects = await Subjects.find(filter);
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllSubject,
  createNewSubject,
  deleteSubject,
  filterSubjects,
};
