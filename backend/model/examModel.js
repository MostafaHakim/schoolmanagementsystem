const mongoose = require("mongoose");
const examSchema = require("../schema/examSchema");

const examModel = new mongoose.model("exam", examSchema);

module.exports = examModel;
