const mongoose = require("mongoose") 

const SemesterSchema = new mongoose.Schema({
  _id: { type: String, required: true }, 
  number: { type: Number, required: true },
  branchId: {
    type: String,
    ref: "Branch",
    required: true
  },
    badge: String,

});

module.exports = mongoose.model("Semester", SemesterSchema);
