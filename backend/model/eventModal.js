const mongoose = require("mongoose");
const eventSchema = require("../schema/eventSchema");

const eventModel = new mongoose.model("events", eventSchema);

module.exports = eventModel;
