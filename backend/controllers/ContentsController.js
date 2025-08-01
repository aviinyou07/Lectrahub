const Content = require("../models/Contents");

// GET all content sections
exports.getAllContents = async (req, res) => {
  try {
    const contents = await Content.find().populate("subjectId");
    res.json(contents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET a single content section by ID
exports.getContentById = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id).populate("subjectId");
    if (!content) return res.status(404).json({ error: "Content not found" });
    res.json(content);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// ADD new content section with file upload
exports.addContent = async (req, res) => {
  try {
    const {
      _id,
      subjectId,
      title,
      description,
      type,
      items: itemsFromBody,
    } = req.body;

    // Files uploaded via multer
    const files = req.files || [];

    // Build items from files
    const uploadedItems = files.map((file) => ({
      name: file.originalname,
      type: file.mimetype,
      size: (file.size / 1024).toFixed(2) + " KB",
      cloudinaryUrl: file.path,
      public_id: file.filename,
    }));

    // Handle case where user uploads nothing
    const parsedItems = typeof itemsFromBody === "string"
      ? JSON.parse(itemsFromBody)
      : itemsFromBody || [];

    const allItems = [...parsedItems, ...uploadedItems];

    const newContent = new Content({
      _id,
      subjectId,
      title,
      description,
      type,
      items: allItems,
    });

    await newContent.save();
    res.status(201).json(newContent);
  } catch (err) {
    console.error("❌ Error in addContent:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// EDIT content section with file upload
exports.editContent = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      subjectId,
      title,
      description,
      type,
      items: itemsFromBody,
    } = req.body;

    const files = req.files || [];

    const uploadedItems = files.map((file) => ({
      name: file.originalname,
      type: file.mimetype,
      size: (file.size / 1024).toFixed(2) + " KB",
      cloudinaryUrl: file.path,
      public_id: file.filename,
    }));

    const parsedItems = typeof itemsFromBody === "string"
      ? JSON.parse(itemsFromBody)
      : itemsFromBody || [];

    const allItems = [...parsedItems, ...uploadedItems];

    const updated = await Content.findByIdAndUpdate(
      id,
      { subjectId, title, description, type, items: allItems },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Content not found" });

    res.json(updated);
  } catch (err) {
    console.error("❌ Error in editContent:", err.message);
    res.status(500).json({ error: err.message });
  }
};


// DELETE content section
exports.deleteContent = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Content.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Content not found" });

    res.json({ message: "Content deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getContentsBySubject = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const contents = await Content.find({ subjectId }).populate("subjectId");
    res.json(contents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const archiver = require("archiver");
const axios = require("axios");


exports.downloadBySubject = async (req, res) => {
  const { subjectId } = req.params;

  try {
    const contents = await Content.find({ subjectId });

    if (!contents || contents.length === 0) {
      return res.status(404).json({ error: "No content found for this subject" });
    }

    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", `attachment; filename=${subjectId}-materials.zip`);

    const archive = archiver("zip", { zlib: { level: 9 } });

    archive.on("error", (err) => {
      console.error("Archiver error:", err.message);
      res.status(500).end("Error creating archive");
    });

    archive.pipe(res);

    for (const content of contents) {
      for (const item of content.items || []) {
        const url = item.cloudinaryUrl;
        const fileName = item.name || "file-from-cloudinary.pdf";

        if (url) {
          try {
            const response = await axios.get(url, { responseType: "stream" });
            archive.append(response.data, { name: fileName });
          } catch (err) {
            console.warn(`Skipping failed file [${fileName}]: ${url} – ${err.message}`);
            // Optionally: continue without adding the file
          }
        }
      }
    }

    await archive.finalize();
  } catch (err) {
    console.error("Download error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};


exports.getContentStatsBySubject = async (req, res) => {
  try {
    const { subjectId } = req.params;

    const sections = await Content.find({ subjectId });

    const notesCount = sections
      .filter(s => s.type === 'notes')
      .reduce((acc, s) => acc + s.items.length, 0);

    const videosCount = sections
      .filter(s => s.type === 'videos')
      .reduce((acc, s) => acc + s.items.length, 0);

    res.json({ notesCount, videosCount });
  } catch (err) {
    console.error("Error fetching content stats:", err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
};