const mongoose = require("mongoose");
const MONGODB_URI = process.env.MONGODB_URI;

const connectDb = mongoose.connect(MONGODB_URI).then(() => {
  console.log("db connect successfully");
});

module.exports = connectDb;
