const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
  getAllCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollInCourse,
  getCourseStats,
} = require("../controllers/courseController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/roleMiddleware");

// Set up storage for uploaded images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save in uploads/ folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // unique file name
  },
});

const upload = multer({ storage });

// Public: Get all courses
router.get("/", getAllCourses);

// Admin: Create course (with image upload)
router.post("/", protect, adminOnly, upload.single("image"), createCourse);

//  Admin: Update/Delete
router.put("/:id", protect, adminOnly, updateCourse);
router.delete("/:id", protect, adminOnly, deleteCourse);

//  Student: Enroll
router.post("/:id/enroll", protect, enrollInCourse);

// Admin: Stats
router.get("/stats/all", protect, adminOnly, getCourseStats);

module.exports = router;
