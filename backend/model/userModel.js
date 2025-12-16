const mongoose = require("mongoose");
const userSchema = require("../schema/userSchema");

const userModel = new mongoose.model("users", userSchema);

module.exports = userModel;
