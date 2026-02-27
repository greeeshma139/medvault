const Reminder = require("../models/Reminder");
const Notification = require("../models/Notification");

// Create reminder
exports.createReminder = async (req, res) => {
  try {
    const {
      type,
      title,
      description,
      reminderDate,
      frequency,
      relatedEntityId,
      relatedEntityType,
    } = req.body;

    if (!type || !title || !reminderDate) {
      return res.status(400).json({
        success: false,
        message: "type, title, and reminderDate are required",
      });
    }

    const reminder = await Reminder.create({
      userId: req.user.id,
      type,
      title,
      description,
      reminderDate,
      frequency: frequency || "once",
      relatedEntityId,
      relatedEntityType,
      isActive: true,
    });

    res.status(201).json({ success: true, reminder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all reminders for user
exports.getReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find({
      userId: req.user.id,
      isActive: true,
    }).sort({ reminderDate: 1 });

    res.json({ success: true, reminders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get upcoming reminders (within 7 days)
exports.getUpcomingReminders = async (req, res) => {
  try {
    const now = new Date();
    const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const reminders = await Reminder.find({
      userId: req.user.id,
      isActive: true,
      reminderDate: {
        $gte: now,
        $lte: sevenDaysLater,
      },
    }).sort({ reminderDate: 1 });

    res.json({ success: true, reminders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update reminder
exports.updateReminder = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, reminderDate, frequency } = req.body;

    const reminder = await Reminder.findById(id);
    if (!reminder) {
      return res
        .status(404)
        .json({ success: false, message: "Reminder not found" });
    }

    if (String(reminder.userId) !== req.user.id) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    if (title) reminder.title = title;
    if (description) reminder.description = description;
    if (reminderDate) reminder.reminderDate = reminderDate;
    if (frequency) reminder.frequency = frequency;

    await reminder.save();

    res.json({ success: true, reminder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Deactivate reminder
exports.deactivateReminder = async (req, res) => {
  try {
    const { id } = req.params;

    const reminder = await Reminder.findById(id);
    if (!reminder) {
      return res
        .status(404)
        .json({ success: false, message: "Reminder not found" });
    }

    if (String(reminder.userId) !== req.user.id) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    reminder.isActive = false;
    await reminder.save();

    res.json({ success: true, message: "Reminder deactivated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Mark reminder as completed
exports.completeReminder = async (req, res) => {
  try {
    const { id } = req.params;

    const reminder = await Reminder.findById(id);
    if (!reminder) {
      return res
        .status(404)
        .json({ success: false, message: "Reminder not found" });
    }

    if (String(reminder.userId) !== req.user.id) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    reminder.completedAt = Date.now();
    if (reminder.frequency === "once") {
      reminder.isActive = false;
    }
    await reminder.save();

    res.json({ success: true, reminder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
