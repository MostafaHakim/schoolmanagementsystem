const mongoose = require("mongoose");
const subjectSchema = require("../schema/subjectSchema");

const subjectModel = new mongoose.model("subjects", subjectSchema);

module.exports = subjectModel;
