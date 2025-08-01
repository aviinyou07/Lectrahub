const Subject = require("../models/Subject");

// Create a new subject
const createSubject = async (req, res) => {
  try {
    const { _id, title, description, badge, credits, semesterId } = req.body;

    if (!_id || !title || !semesterId) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const existing = await Subject.findById(_id);
    if (existing) {
      return res.status(409).json({ message: "Subject ID already exists." });
    }

    const subject = new Subject({
      _id,
      title,
      description,
      badge,
      credits,
      semesterId,
    });

    const saved = await subject.save();
    return res.status(201).json(saved);
  } catch (err) {
    return res.status(500).json({ message: "Error creating subject.", error: err.message });
  }
};

// Get all subjects
const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find().populate("semesterId");
    return res.json(subjects);
  } catch (err) {
    return res.status(500).json({ message: "Error fetching subjects.", error: err.message });
  }
};

// Get one subject by ID
const getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id).populate("semesterId");
    if (!subject) {
      return res.status(404).json({ message: "Subject not found." });
    }
    return res.json(subject);
  } catch (err) {
    return res.status(500).json({ message: "Error fetching subject.", error: err.message });
  }
};

// Update a subject
const updateSubject = async (req, res) => {
  try {
    const updated = await Subject.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) {
      return res.status(404).json({ message: "Subject not found." });
    }
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ message: "Error updating subject.", error: err.message });
  }
};

// Delete a subject
const deleteSubject = async (req, res) => {
  try {
    const deleted = await Subject.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Subject not found." });
    }
    return res.json({ message: "Subject deleted successfully." });
  } catch (err) {
    return res.status(500).json({ message: "Error deleting subject.", error: err.message });
  }
};

module.exports = {
  createSubject,
  getSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
};
