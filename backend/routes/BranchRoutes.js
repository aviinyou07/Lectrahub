const express = require("express");
const router = express.Router();
const {
  getAllBranches,
  createBranch,
  updateBranch,
  deleteBranch,
  getBranchStats
} = require("../controllers/BranchController");
const authMiddleware = require("../middlewares/adminAuth");

router.get("/", getAllBranches);
router.get("/stats", getBranchStats);
router.post("/", authMiddleware, createBranch);
router.put("/:id", authMiddleware, updateBranch);
router.delete("/:id", authMiddleware, deleteBranch);

module.exports = router;
