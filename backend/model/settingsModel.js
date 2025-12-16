const mongoose = require("mongoose");
const settingsSchema = require("../schema/settingsSchema");

const settingsModel = new mongoose.model("settings", settingsSchema);

module.exports = settingsModel;
