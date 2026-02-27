const MedicalRecord = require("../models/MedicalRecord");
const User = require("../models/User");
const Notification = require("../models/Notification");
const Consent = require("../models/Consent");

// Helper function to log access
const logAccess = async (recordId, userId, accessType) => {
  try {
    await MedicalRecord.findByIdAndUpdate(recordId, {
      $push: {
        accessLog: {
          userId,
          accessType,
          accessedAt: Date.now(),
        },
      },
    });
  } catch (error) {
    console.error("Error logging access:", error);
  }
};

// Create medical record (doctor or patient)
exports.createRecord = async (req, res) => {
  try {
    const {
      patientId,
      recordType,
      title,
      description,
      diagnosis,
      treatment,
      medicines,
      visitDate,
      nextFollowUp,
    } = req.body;

    if (!recordType || !title) {
      return res.status(400).json({
        success: false,
        message: "recordType and title are required",
      });
    }

    // If patientId provided, it's a doctor creating a record for a patient
    // Otherwise, patient is creating their own record
    const finalPatientId =
      patientId || (req.user.role === "patient" ? req.user.id : null);

    if (!finalPatientId) {
      return res.status(400).json({
        success: false,
        message: "Patient ID is required",
      });
    }

    // verify patient exists
    const patient = await User.findById(finalPatientId);
    if (!patient)
      return res
        .status(404)
        .json({ success: false, message: "Patient not found" });

    const record = new MedicalRecord({
      patientId: finalPatientId,
      doctorId: req.user.role === "professional" ? req.user.id : null,
      recordType,
      title,
      description,
      diagnosis,
      treatment,
      medicines: medicines || [],
      visitDate: visitDate || Date.now(),
      nextFollowUp,
      isSharedWithPatient: true,
    });

    await record.save();

    // Log access
    await logAccess(record._id, req.user.id, "created");

    // Create notification for patient
    await Notification.create({
      userId: finalPatientId,
      type: "record_update",
      title: "New Medical Record",
      message: `A new ${recordType.replace(/_/g, " ")} record has been added to your profile`,
      relatedEntityId: record._id,
      relatedEntityType: "medical_record",
      priority: "medium",
      sentVia: ["in_app", "email"],
    });

    res.status(201).json({ success: true, record });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update medical record
exports.updateRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      diagnosis,
      treatment,
      medicines,
      nextFollowUp,
    } = req.body;

    const record = await MedicalRecord.findById(id);
    if (!record)
      return res
        .status(404)
        .json({ success: false, message: "Record not found" });

    // Check authorization - patient can only update their own records
    if (
      req.user.role === "patient" &&
      String(record.patientId) !== req.user.id
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    // Update fields
    if (title) record.title = title;
    if (description) record.description = description;
    if (diagnosis) record.diagnosis = diagnosis;
    if (treatment) record.treatment = treatment;
    if (medicines) record.medicines = medicines;
    if (nextFollowUp) record.nextFollowUp = nextFollowUp;

    record.updatedAt = Date.now();
    await record.save();

    // Log access
    await logAccess(id, req.user.id, "updated");

    res
      .status(200)
      .json({ success: true, message: "Record updated successfully", record });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete medical record
exports.deleteRecord = async (req, res) => {
  try {
    const { id } = req.params;

    const record = await MedicalRecord.findById(id);
    if (!record)
      return res
        .status(404)
        .json({ success: false, message: "Record not found" });

    // Check authorization - only patient can delete their records
    if (String(record.patientId) !== req.user.id) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    // Log the deletion
    await logAccess(id, req.user.id, "deleted");

    await MedicalRecord.findByIdAndDelete(id);

    res
      .status(200)
      .json({ success: true, message: "Record deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add document to record
exports.addDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { fileName, fileUrl } = req.body;

    if (!fileName || !fileUrl) {
      return res.status(400).json({
        success: false,
        message: "fileName and fileUrl are required",
      });
    }

    const record = await MedicalRecord.findById(id);
    if (!record)
      return res
        .status(404)
        .json({ success: false, message: "Record not found" });

    // Check authorization
    if (
      String(record.patientId) !== req.user.id &&
      String(record.doctorId) !== req.user.id
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    record.documents.push({
      fileName,
      fileUrl,
      uploadedAt: Date.now(),
    });

    await record.save();

    res
      .status(200)
      .json({ success: true, message: "Document added successfully", record });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get records for a given patient (patient or doctor with consent)
exports.getPatientRecords = async (req, res) => {
  try {
    const { patientId } = req.params;

    // Check authorization
    if (req.user.role === "patient" && req.user.id !== patientId) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    // If professional, check if they have consent
    if (req.user.role === "professional") {
      const consent = await Consent.findOne({
        patientId,
        professionalId: req.user.id,
        status: "approved",
      });

      if (!consent) {
        return res.status(403).json({
          success: false,
          message: "No consent to access these records",
        });
      }
    }

    const records = await MedicalRecord.find({ patientId }).sort({
      visitDate: -1,
    });

    // Log access for each record
    for (const record of records) {
      await logAccess(record._id, req.user.id, "viewed");
    }

    res.status(200).json({ success: true, records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get current patient's records (patient)
exports.getMyRecords = async (req, res) => {
  try {
    if (req.user.role !== "patient")
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });

    const records = await MedicalRecord.find({ patientId: req.user.id }).sort({
      visitDate: -1,
    });

    // Log access
    for (const record of records) {
      await logAccess(record._id, req.user.id, "viewed");
    }

    res.status(200).json({ success: true, records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get records by type (filtered)
exports.getRecordsByType = async (req, res) => {
  try {
    const { recordType } = req.params;
    const patientId =
      req.user.role === "patient" ? req.user.id : req.params.patientId;

    if (!patientId) {
      return res.status(400).json({
        success: false,
        message: "Patient ID is required",
      });
    }

    // Check authorization
    if (req.user.role === "patient" && req.user.id !== patientId) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    const records = await MedicalRecord.find({ patientId, recordType }).sort({
      visitDate: -1,
    });

    res.status(200).json({ success: true, records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
