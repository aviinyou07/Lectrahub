const mongoose = require("mongoose");

const ContentItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  size: { type: String },              
  cloudinaryUrl: { type: String, required: true }, 
  public_id: { type: String }                       
}, { _id: false });

const ContentSectionSchema = new mongoose.Schema({
  _id: { type: String, required: true },  // e.g., "lecture-notes"
  subjectId: {
    type: String,
    ref: "Subject",
    required: true
  },
  title: { type: String, required: true },
  description: { type: String },
  type: {
    type: String,
    enum: ["notes", "videos", "syllabus", "extras"],
    required: true
  },
  items: [ContentItemSchema]
}, { timestamps: true });

module.exports = mongoose.model("ContentSection", ContentSectionSchema);
