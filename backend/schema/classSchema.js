const mongoose = require("mongoose");
const classSchema = mongoose.Schema({
  className: String,
  sessionName: String,
});

module.exports = classSchema;
