const mongoose = require("mongoose");
const classSchema = require("../schema/classSchema");

const classModel = new mongoose.model("classes", classSchema);

module.exports = classModel;
