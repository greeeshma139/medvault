const mongoose = require('mongoose');

const MedicalRecordSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Professional',
  },
  recordType: {
    type: String,
    enum: ['prescription', 'lab_report', 'medical_history', 'vaccination', 'surgery', 'other'],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: String,
  diagnosis: String,
  treatment: String,
  medicines: [
    {
      name: String,
      dosage: String,
      frequency: String,
      duration: String,
    },
  ],
  documents: [
    {
      fileName: String,
      fileUrl: String,
      uploadedAt: { type: Date, default: Date.now },
    },
  ],
  visitDate: Date,
  nextFollowUp: Date,
  attachments: [String],
  isSharedWithPatient: {
    type: Boolean,
    default: true,
  },
  accessLog: [
    {
      userId: mongoose.Schema.Types.ObjectId,
      accessedAt: { type: Date, default: Date.now },
      accessType: String,
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

module.exports = mongoose.model('MedicalRecord', MedicalRecordSchema);
