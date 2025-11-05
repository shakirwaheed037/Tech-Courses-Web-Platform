const Notification = require("../models/Notification");

// Get all notifications (Admin)
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notifications" });
  }
};

// Mark a notification as read (optional future feature)
exports.markAsRead = async (req, res) => {
  try {
    const notif = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    res.json(notif);
  } catch (error) {
    res.status(400).json({ message: "Failed to mark as read" });
  }
};
