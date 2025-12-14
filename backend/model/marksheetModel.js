const mongoose = require("mongoose");
const marksheetSchema = require("../schema/marksheetSchema");

const Marksheet = mongoose.model("Marksheet", marksheetSchema);

module.exports = Marksheet;
