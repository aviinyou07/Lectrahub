const Semester = require("../models/Semester");

// Create a new semester
exports.createSemester = async (req, res) => {
  try {
    const semester = new Semester(req.body);
    await semester.save();
    res.status(201).json({ message: "Semester created", data: semester });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update semester
exports.updateSemester = async (req, res) => {
  try {
    const updated = await Semester.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Semester not found" });
    res.json({ message: "Semester updated", data: updated });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete semester
exports.deleteSemester = async (req, res) => {
  try {
    const deleted = await Semester.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Semester not found" });
    res.json({ message: "Semester deleted", data: deleted });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all semesters (with optional filters)
exports.getSemesters = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", branchId } = req.query;

    const query = {};

    if (branchId) query.branchId = branchId;

    // Only apply number search if the input is a valid number
    if (search && !isNaN(Number(search))) {
      query.number = Number(search);
    }

    const total = await Semester.countDocuments(query);
    const data = await Semester.find(query)
      .populate({
        path: "branchId",
        populate: {
          path: "courseId",
          populate: { path: "universityId" },
        },
      })
      .sort({ number: 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      data,
      total,
      currentPage: parseInt(page),
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch semesters" });
  }
};


const Content = require("../models/Contents");
const Subject = require("../models/Subject");

exports.getSemesterStats = async (req, res) => {
  const { branchId } = req.query;

  if (!branchId) {
    return res.status(400).json({ message: "branchId is required" });
  }

  try {
    const semesters = await Semester.find({ branchId });
    const semesterIds = semesters.map((s) => s._id);

    // Fetch all subjects in one go
    const subjects = await Subject.find({ semesterId: { $in: semesterIds } });

    // Group subjects by semesterId
    const subjectsBySemester = {};
    for (const subj of subjects) {
      if (!subjectsBySemester[subj.semesterId]) {
        subjectsBySemester[subj.semesterId] = [];
      }
      subjectsBySemester[subj.semesterId].push(subj);
    }

    // Get all subjectIds
    const allSubjectIds = subjects.map((s) => s._id);

    // Fetch all content sections for all subjects at once
    const sections = await Content.find({ subjectId: { $in: allSubjectIds } });

    // Group sections by subjectId
    const sectionsBySubject = {};
    for (const section of sections) {
      if (!sectionsBySubject[section.subjectId]) {
        sectionsBySubject[section.subjectId] = [];
      }
      sectionsBySubject[section.subjectId].push(section);
    }

    const stats = semesters.map((sem) => {
      const semSubjects = subjectsBySemester[sem._id] || [];

      const subjectsCount = semSubjects.length;
      const totalCredits = semSubjects.reduce((sum, subj) => sum + (subj.credits || 0), 0);

      let materialsCount = 0;
      for (const subj of semSubjects) {
        const subjSections = sectionsBySubject[subj._id] || [];
        materialsCount += subjSections.reduce((acc, sec) => acc + (sec.items?.length || 0), 0);
      }

      return {
        semester: sem.number,
        subjectsCount,
        materialsCount,
        totalCredits,
      };
    });

    res.json({ data: stats });
  } catch (err) {
    console.error("❌ Error in getSemesterStats:", err);
    res.status(500).json({ message: "Server error while fetching semester stats" });
  }
};
