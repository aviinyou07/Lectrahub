const express = require("express");
const router = express.Router();
const semesterController = require("../controllers/SemesterController");
const auth = require("../middlewares/adminAuth");

router.get("/", semesterController.getSemesters);
router.get("/stats", semesterController.getSemesterStats);
router.post("/", auth, semesterController.createSemester);
router.put("/:id", auth, semesterController.updateSemester);
router.delete("/:id", auth, semesterController.deleteSemester);

module.exports = router;
