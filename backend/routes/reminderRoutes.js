const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const controller = require("../controllers/reminderController");

// Create reminder
router.post("/", auth, controller.createReminder);

// Get all reminders
router.get("/", auth, controller.getReminders);

// Get upcoming reminders
router.get("/upcoming", auth, controller.getUpcomingReminders);

// Update reminder
router.put("/:id", auth, controller.updateReminder);

// Complete reminder
router.put("/:id/complete", auth, controller.completeReminder);

// Deactivate reminder
router.delete("/:id", auth, controller.deactivateReminder);

module.exports = router;
