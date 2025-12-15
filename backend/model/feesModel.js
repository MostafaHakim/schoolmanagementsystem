const mongoose = require("mongoose");
const feesSchema = require("../schema/feesSchema");

const feesModel = new mongoose.model("fees", feesSchema);

module.exports = feesModel;
