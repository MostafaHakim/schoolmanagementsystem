const mongoose = require("mongoose");
const studentSchema = require("../schema/studentSchema");

const studentModel = new mongoose.model("students", studentSchema);

module.exports = studentModel;
