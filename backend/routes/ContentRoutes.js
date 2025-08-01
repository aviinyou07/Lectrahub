const express = require("express");
const router = express.Router();
const contentController = require("../controllers/ContentsController");
const auth = require("../middlewares/adminAuth");
const upload = require("../utills/uploadContentFile");

// GET all contents (no auth)
router.get("/", contentController.getAllContents);

router.get("/subject/:subjectId", contentController.getContentsBySubject);

router.get("/download/subject/:subjectId", contentController.downloadBySubject);

router.get("/stats/subject/:subjectId", contentController.getContentStatsBySubject);

// GET single content (protected)
router.get("/:id", auth, contentController.getContentById);

// ADD new content with files
router.post("/", auth, upload.array("files"), contentController.addContent);

// EDIT content and support new file uploads
router.put("/:id", auth, upload.array("files"), contentController.editContent);

// DELETE content (protected)
router.delete("/:id", auth, contentController.deleteContent);

module.exports = router;
