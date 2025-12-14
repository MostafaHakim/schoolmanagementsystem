const mongoose = require("mongoose");
const sessionSchema = require("../schema/sessionSchema");

const sessionModel = new mongoose.model("sessions", sessionSchema);

module.exports = sessionModel;
