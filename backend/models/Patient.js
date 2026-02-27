const mongoose = require("mongoose");

const PatientSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  dateOfBirth: {
    type: Date,
    required: false,
    default: null,
  },
  gender: {
    type: String,
    enum: ["male", "female", "other", null],
    required: false,
    default: null,
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  bloodType: {
    type: String,
    enum: ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"],
  },
  allergies: [String],
  medicalHistory: [String],
  emergencyContact: {
    name: String,
    phoneNumber: String,
    relationship: String,
  },
  insuranceInfo: {
    providerName: String,
    policyNumber: String,
    groupNumber: String,
  },
  preferredDoctors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Professional",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Patient", PatientSchema);
