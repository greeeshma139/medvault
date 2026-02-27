const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const controller = require("../controllers/notificationController");

// Get all notifications
router.get("/", auth, controller.getNotifications);

// Get unread count (specific route before dynamic :id)
router.get("/unread/count", auth, controller.getUnreadCount);

// Mark all as read (specific route before dynamic :id)
router.put("/read/all", auth, controller.markAllAsRead);

// Dynamic routes (must come last)
router.put("/:id/read", auth, controller.markAsRead);
router.delete("/:id", auth, controller.deleteNotification);

module.exports = router;
