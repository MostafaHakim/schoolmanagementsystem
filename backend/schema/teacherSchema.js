const mongoose = require("mongoose");
const teacherSchema = mongoose.Schema({
  teacherName: String,
  teacherMobile: String,
  teacherAddress: String,
});

module.exports = teacherSchema;
