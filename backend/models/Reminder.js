const mongoose = require("mongoose");

const ReminderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: [
      "appointment",
      "prescription_refill",
      "health_checkup",
      "medication",
      "follow_up",
    ],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: String,
  relatedEntityId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  relatedEntityType: {
    type: String,
    enum: ["appointment", "medical_record", "medication"],
  },
  reminderDate: {
    type: Date,
    required: true,
  },
  frequency: {
    type: String,
    enum: ["once", "daily", "weekly", "monthly"],
    default: "once",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  notificationSent: {
    type: Boolean,
    default: false,
  },
  notificationSentAt: Date,
  completedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Reminder", ReminderSchema);
