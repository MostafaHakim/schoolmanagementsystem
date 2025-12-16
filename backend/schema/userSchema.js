const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
  userName: String,
  password: String,
  userType: {
    type: String,
    enum: ["admin", "user", "accounts", "student", "parants"],
  },
  userMobile: String,
});

module.exports = userSchema;
