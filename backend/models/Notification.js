const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: [
      "appointment",
      "prescription",
      "health_checkup",
      "record_update",
      "access_request",
      "general",
    ],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  relatedEntityId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  relatedEntityType: {
    type: String,
    enum: ["appointment", "medical_record", "consent", "reminder"],
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },
  sentVia: {
    type: [String],
    enum: ["in_app", "email", "sms"],
    default: ["in_app"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  readAt: {
    type: Date,
  },
});

module.exports = mongoose.model("Notification", NotificationSchema);
