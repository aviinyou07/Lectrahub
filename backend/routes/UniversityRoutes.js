const express = require("express");
const router = express.Router();
const upload = require("../utills/uploadImage");
const auth = require("../middlewares/adminAuth");
const {
  getAllUniversities,
  addUniversity,
  editUniversity,
  deleteUniversity,
  getUniversityById
} = require("../controllers/UniversityController");

router.get("/", getAllUniversities);
router.get('/:id', getUniversityById);
router.post("/", auth, upload.single("image"), addUniversity);
router.put("/:id", auth, upload.single("image"), editUniversity);
router.delete("/:id", auth, deleteUniversity);


module.exports = router;
