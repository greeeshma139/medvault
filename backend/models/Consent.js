const mongoose = require("mongoose");

const ConsentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  professionalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  recordIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MedicalRecord",
    },
  ],
  consentType: {
    type: String,
    enum: ["all_records", "specific_records", "record_type"],
    required: true,
  },
  recordTypesAllowed: [
    {
      type: String,
      enum: [
        "prescription",
        "lab_report",
        "medical_history",
        "vaccination",
        "surgery",
        "other",
      ],
    },
  ],
  accessScope: {
    type: String,
    enum: ["read_only", "read_write"],
    default: "read_only",
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  expiryDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "revoked"],
    default: "pending",
  },
  approvedAt: Date,
  revokedAt: Date,
  reason: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Consent", ConsentSchema);
