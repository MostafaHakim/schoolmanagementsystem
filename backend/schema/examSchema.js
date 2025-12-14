const mongoose = require("mongoose");
const examSchema = mongoose.Schema({
  examName: String,
  sessionName: String,
});

module.exports = examSchema;
