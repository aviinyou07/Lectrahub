const express = require("express");
const router = express.Router();
const {
  getAllCourses,
  getCoursesByUniversity,
  addCourse,
  updateCourse,
  deleteCourse,
  getCourseCountByUniversity,
  getCourseStats
} = require("../controllers/CoursesController");

const authAdmin = require("../middlewares/adminAuth");

router.post("/", authAdmin, addCourse);
router.get("/", authAdmin, getAllCourses);
router.get("/stats", getCourseStats);

router.get("/university/:universityId", getCoursesByUniversity);

router.get('/university/:universityId/count', getCourseCountByUniversity);
router.put("/:id", authAdmin, updateCourse);
router.delete("/:id", authAdmin, deleteCourse);


module.exports = router;
