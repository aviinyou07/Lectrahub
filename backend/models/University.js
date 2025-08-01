const mongoose = require("mongoose") 
const UniversitySchema = new mongoose.Schema({
  _id: { type: String, required: true }, // use short ids like 'mit', 'harvard'
  title: { type: String, required: true },
  description: String,
  badge: String,
  students:String,
  faculty:String,
  imageUrl: String
});

module.exports =  mongoose.model("University", UniversitySchema);
