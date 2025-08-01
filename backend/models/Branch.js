const mongoose = require("mongoose") 

const BranchSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  courseId: {
    type: String,
    ref: "Course",
    required: true
  },
  title: { type: String, required: true },
  description: String,
  badge: String,
});

module.exports = mongoose.model("Branch", BranchSchema);
