const express = require("express");
const router = express.Router();
const {
  getNotifications,
  markAsRead
} = require("../controllers/notificationController");

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/roleMiddleware");

// 👨‍🏫 Admin: Get all notifications
router.get("/", protect, adminOnly, getNotifications);

// 👨‍🏫 Admin: Mark a notification as read
router.put("/:id/read", protect, adminOnly, markAsRead);

module.exports = router;
