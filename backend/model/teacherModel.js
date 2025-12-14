const mongoose = require("mongoose");
const teacherSchema = require("../schema/teacherSchema");

const teacherModel = new mongoose.model("teachers", teacherSchema);

module.exports = teacherModel;
