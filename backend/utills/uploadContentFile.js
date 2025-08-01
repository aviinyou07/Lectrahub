const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "contents",
    allowed_formats: ["jpg", "png", "jpeg", "pdf", "docx", "ppt", "mp4", "webm"],
    resource_type: "auto",
  },
});

const upload = multer({ storage });

module.exports = upload;