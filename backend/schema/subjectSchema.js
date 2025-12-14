const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema(
  {
    subjectName: {
      type: String,
      required: true,
      trim: true,
    },

    subjectClass: {
      type: String,
      required: true,
      trim: true,
    },

    subjectType: {
      type: String,
      enum: ["compulsory", "optional"],
      required: true,
    },
  },
  { timestamps: true }
);

// 🔐 Prevent duplicate subject per class
subjectSchema.index({ subjectName: 1, subjectClass: 1 }, { unique: true });

module.exports = subjectSchema;
