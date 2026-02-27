const mongoose = require("mongoose");

const ProfessionalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  specialization: {
    type: String,
    required: false,
    default: "General Practice",
  },
  licenseNumber: {
    type: String,
    required: false,
    unique: false,
    default: () => "LIC-" + Date.now(),
  },
  registrationNumber: String,
  yearsOfExperience: Number,
  qualifications: [String],
  clinicName: String,
  clinicAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  consultationFee: Number,
  availability: {
    monday: { startTime: String, endTime: String, isAvailable: Boolean },
    tuesday: { startTime: String, endTime: String, isAvailable: Boolean },
    wednesday: { startTime: String, endTime: String, isAvailable: Boolean },
    thursday: { startTime: String, endTime: String, isAvailable: Boolean },
    friday: { startTime: String, endTime: String, isAvailable: Boolean },
    saturday: { startTime: String, endTime: String, isAvailable: Boolean },
    sunday: { startTime: String, endTime: String, isAvailable: Boolean },
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    default: 5.0,
    min: 0,
    max: 5,
  },
  totalpatients: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Professional", ProfessionalSchema);
