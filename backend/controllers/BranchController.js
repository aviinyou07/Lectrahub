const Branch = require("../models/Branch");

const getAllBranches = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", courseId } = req.query;

    const filter = {};

    if (courseId && courseId.trim() !== "") {
      filter.courseId = courseId;
    }

    if (search && search.trim() !== "") {
      filter.title = { $regex: search.trim(), $options: "i" };
    }

    const total = await Branch.countDocuments(filter);

    const branches = await Branch.find(filter)
      .populate({ path: "courseId", select: "title universityId" })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ data: branches, total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// POST /api/branches
const createBranch = async (req, res) => {
  try {
    const { _id, title, description, badge, courseId } = req.body;

    if (!title || !_id || !courseId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newBranch = await Branch.create({
      _id,
      title,
      description,
      badge,
      courseId,
    });

    res.status(201).json(newBranch);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create branch" });
  }
};

// PUT /api/branches/:id
const updateBranch = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, badge, courseId } = req.body;

    const updated = await Branch.findByIdAndUpdate(
      id,
      { title, description, badge, courseId },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Branch not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update branch" });
  }
};

// DELETE /api/branches/:id
const deleteBranch = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Branch.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Branch not found" });
    }
    res.json({ message: "Branch deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete branch" });
  }
};
const Semester = require("../models/Semester");
const Subject = require("../models/Subject");

const getBranchStats = async (req, res) => {
  try {
    const courseId = req.query.courseId;

    const branches = await Branch.find({ courseId });

    const stats = await Promise.all(
      branches.map(async (branch) => {
        const semesters = await Semester.find({ branchId: branch._id });
        const semesterIds = semesters.map((s) => s._id);

        const coreSubjects = await Subject.countDocuments({
          semesterId: { $in: semesterIds },
          badge: /core/i  // matches "Core" case-insensitively
        });

        const electives = await Subject.countDocuments({
          semesterId: { $in: semesterIds },
          badge: /elective/i
        });

        return {
          id: branch._id,
          title: branch.title,
          description: branch.description,
          badge: branch.badge,
          semestersCount: semesters.length,
          coreSubjects,
          electives
        };
      })
    );

    res.json({ success: true, data: stats });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



module.exports = {
  getAllBranches,
  createBranch,
  updateBranch,
  deleteBranch,
  getBranchStats
};

