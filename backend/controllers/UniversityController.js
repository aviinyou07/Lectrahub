const University = require("../models/University");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

// Helper to extract Cloudinary public_id from image URL
const getCloudinaryPublicId = (url) => {
  try {
    const parts = url.split("/");
    const filename = parts[parts.length - 1];
    const publicId = filename.split(".")[0]; 
    return `universities/${publicId}`;
  } catch {
    return null;
  }
};

// GET all universities
const getAllUniversities = async (req, res) => {
  try {
    const universities = await University.find().sort({ title: 1 });
    res.json({ data: universities }); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// ADD new university
const addUniversity = async (req, res) => {
  try {
    const { _id, title, description, badge, students, faculty } = req.body;

    if (!_id || !title) {
      return res.status(400).json({ message: "ID and title are required" });
    }

    // Check if slug/ID already exists
    const existing = await University.findById(_id);
    if (existing) {
      return res.status(409).json({ message: "University ID already exists" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "universities",
    });

    const newUniversity = new University({
      _id,
      title,
      description,
      badge,
      students,
      faculty,
      imageUrl: result.secure_url,
    });

    const saved = await newUniversity.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("POST error:", err);
    res.status(500).json({ message: "Add failed" });
  }
};

// EDIT university
const editUniversity = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await University.findById(id);

    if (!existing) {
      return res.status(404).json({ message: "University not found" });
    }

    const updateData = req.body;

    if (req.file) {
      // Upload new image
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "universities",
      });
      updateData.imageUrl = result.secure_url;
      fs.unlinkSync(req.file.path);

      // Delete old image from Cloudinary
      const publicId = getCloudinaryPublicId(existing.imageUrl);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    }

    const updated = await University.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  }
};

// DELETE university
const deleteUniversity = async (req, res) => {
  try {
    const { id } = req.params;
    const uni = await University.findByIdAndDelete(id);

    if (uni?.imageUrl) {
      const publicId = getCloudinaryPublicId(uni.imageUrl);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    }

    res.json({ message: "University deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Delete failed" });
  }
};

const getUniversityById = async (req, res) => {
  try {
    const university = await University.findById(req.params.id); // or .findOne({ _id: req.params.id }) — same here
    if (!university) {
      return res.status(404).json({ message: "University not found" });
    }
    res.json(university);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch university" });
  }
};

module.exports = {
  getAllUniversities,
  addUniversity,
  editUniversity,
  deleteUniversity,
  getUniversityById
};

