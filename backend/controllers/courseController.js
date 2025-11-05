const Course = require("../models/Course");
const User = require("../models/User");
const Notification = require("../models/Notification");
const path = require("path");

// Get all courses (for students & admin)
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate("enrolledStudents", "name email");
    res.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ message: "Error fetching courses" });
  }
};




// 🧑‍🏫 Admin: Create a new course (with image upload)
exports.createCourse = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }

    const { title, description, lessons } = req.body;

    if (!title || !description || !lessons || !req.file) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Build the course
 const newCourse = await Course.create({
  title,
  description,
  lessons,
  image: `/uploads/${req.file.filename}`,
  createdBy: req.user._id,
});


    res.status(201).json(newCourse);
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(400).json({ message: error.message });
  }
};


//  Admin: Update a course
exports.updateCourse = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }

    const updated = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updated) return res.status(404).json({ message: "Course not found" });

    res.json(updated);
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(400).json({ message: error.message });
  }
};

//  Admin: Delete a course
exports.deleteCourse = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }

    const deleted = await Course.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Course not found" });

    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(400).json({ message: "Failed to delete course" });
  }
};

//  Student: Enroll in a course
exports.enrollInCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Prevent duplicate enrollment
    if (course.enrolledStudents.includes(req.user._id)) {
      return res.status(400).json({ message: "You are already enrolled in this course" });
    }

    // Enroll student
    course.enrolledStudents.push(req.user._id);
    await course.save();

    // Notify admin (optional)
    const admin = await User.findOne({ role: "admin" });
    if (admin) {
      await Notification.create({
        userId: admin._id,
        message: `${req.user.name} enrolled in ${course.title}`,
      });
    }

    res.json({ message: "Enrollment successful!" });
  } catch (error) {
    console.error("Error enrolling in course:", error);
    res.status(400).json({ message: error.message });
  }
};

//  Admin: View course statistics
exports.getCourseStats = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }
 
    const courses = await Course.find().select("title enrolledStudents");
    const stats = courses.map((course) => ({
      title: course.title,
      totalStudents: course.enrolledStudents.length,
    }));

    res.json(stats);
  } catch (error) {
    console.error("Error fetching course stats:", error);
    res.status(500).json({ message: "Error fetching course stats" });
  }
};
