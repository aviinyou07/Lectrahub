const Course = require("../models/Course");

// @desc    Add new course
// @route   POST /api/courses
// @access  Private (Admin)
const addCourse = async (req, res) => {
  try {
    const { _id, title, description, badge, universityId } = req.body;

    if (!_id || !title || !universityId) {
      return res.status(400).json({ message: "Slug (ID), title, and university are required." });
    }

    const existing = await Course.findById(_id);
    if (existing) {
      return res.status(409).json({ message: "Course with this slug already exists." });
    }

    const course = new Course({
      _id,
      title,
      description,
      badge,
      universityId,
    });

    const saved = await course.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while adding course." });
  }
};

// @desc    Get all courses (pagination + search + filter)
// @route   GET /api/courses
// @access  Private (Admin)
const getAllCourses = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", universityId } = req.query;

    const query = {};
    if (universityId) query.universityId = universityId;
    if (search) query.title = { $regex: search, $options: "i" };

    const total = await Course.countDocuments(query);
    const courses = await Course.find(query)
      .populate("universityId", "title _id")
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ title: 1 });

    res.json({
      data: courses,
      total,
      pages: Math.ceil(total / limit),
      currentPage: Number(page),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch courses." });
  }
};

// @desc    Get courses by university ID
// @route   GET /api/courses/university/:id
// @access  Private (Admin)
const getCoursesByUniversity = async (req, res) => {
  try {
    const { universityId } = req.params;
    const courses = await Course.find({ universityId });
    res.json(courses);
  } catch (err) {
    console.error("Error fetching courses by university:", err);
    res.status(500).json({ message: "Failed to fetch courses" });
  }
};

// @desc    Edit a course (title, badge, description, university only)
// @route   PUT /api/courses/:id
// @access  Private (Admin)
const updateCourse = async (req, res) => {
  try {
    const { title, description, badge, universityId } = req.body;

    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }

    course.title = title || course.title;
    course.description = description || course.description;
    course.badge = badge || course.badge;
    course.universityId = universityId || course.universityId;

    const updated = await course.save();
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update course." });
  }
};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private (Admin)
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }

    res.json({ message: "Course deleted successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete course." });
  }
};

const getCourseCountByUniversity = async (req, res) => {
  try {
    const universityId = req.params.universityId;
    const count = await Course.countDocuments({ universityId });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: "Failed to get course count" });
  }
};


const Branch = require("../models/Branch");
const Semester = require("../models/Semester");
const Subject = require("../models/Subject");

const getCourseStats = async (req, res) => {
  try {
    const { universityId } = req.query;

    if (!universityId) {
      return res.status(400).json({ message: "Missing universityId" });
    }

    // Fetch all courses under the university
    const courses = await Course.find({ universityId });

    const statsPromises = courses.map(async (course) => {
      const branches = await Branch.find({ courseId: course._id });
      const branchIds = branches.map((b) => b._id);

      const semesters = await Semester.find({ branchId: { $in: branchIds } });
      const semesterIds = semesters.map((s) => s._id);

      const subjectsCount = await Subject.countDocuments({ semesterId: { $in: semesterIds } });

      return {
        courseId: course._id,
        title: course.title,
        badge: course.badge || "",
        branchesCount: branches.length,
        semestersCount: semesters.length,
        subjectsCount
      };
    });

    const result = await Promise.all(statsPromises);

    res.json(result);
  } catch (err) {
    console.error("Error in getCourseStats:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  addCourse,
  getAllCourses,
  getCoursesByUniversity,
  updateCourse,
  deleteCourse,
  getCourseCountByUniversity,
  getCourseStats
};
