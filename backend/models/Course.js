const mongoose = require("mongoose") 


const CourseSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // e.g., 'computer-science'
  universityId: {
    type: String,
    ref: "University",
    required: true
  },
  title: { type: String, required: true },
  description: String,
  badge: String,
});

module.exports = mongoose.model("Course", CourseSchema);
