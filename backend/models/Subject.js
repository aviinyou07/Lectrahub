const mongoose = require("mongoose") 

const SubjectSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  semesterId: {
    type: String,
    ref: "Semester",
    required: true
  },
  title: { type: String, required: true },
  description: String,
  badge: String,
  credits:Number,
});

module.exports = mongoose.model("Subject", SubjectSchema);
