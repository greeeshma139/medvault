const Consent = require("../models/Consent");
const Notification = require("../models/Notification");
const User = require("../models/User");

// helper to move already expired approved consents into expired status
async function expireOldConsents() {
  const now = new Date();
  try {
    const oldConsents = await Consent.find({
      status: "approved",
      expiryDate: { $lte: now },
    });
    if (oldConsents.length === 0) return;

    const ids = oldConsents.map((c) => c._id);
    await Consent.updateMany({ _id: { $in: ids } }, { status: "expired", revokedAt: now });
    console.log(`expired ${oldConsents.length} old consents`);

    // send notification to both parties
    for (const c of oldConsents) {
      await Notification.create({
        userId: c.patientId,
        type: "general",
        title: "Consent Expired",
        message: "A previously granted access to your records has expired.",
        relatedEntityId: c._id,
        relatedEntityType: "consent",
        priority: "low",
        sentVia: ["in_app"],
      });
      await Notification.create({
        userId: c.professionalId,
        type: "general",
        title: "Consent Expired",
        message: "Your access to patient records has expired.",
        relatedEntityId: c._id,
        relatedEntityType: "consent",
        priority: "low",
        sentVia: ["in_app"],
      });
    }
  } catch (err) {
    console.error("error expiring consents:", err);
  }
}

// Request access to patient records
exports.requestConsent = async (req, res) => {
  try {
    let {
      patientId,
      consentType,
      recordTypesAllowed,
      accessScope,
      expiryDate,
      reason,
    } = req.body;

    if (!patientId || !consentType) {
      return res.status(400).json({
        success: false,
        message: "patientId and consentType are required",
      });
    }

    // Lookup patient by email or ID
    let patient = null;
    if (patientId.includes("@")) {
      // treat as email
      patient = await User.findOne({ email: patientId, role: "patient" });
    } else {
      // treat as ID
      patient = await User.findById(patientId);
    }

    if (!patient || patient.role !== "patient") {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    patientId = patient._id; // use actual ID

    // Prevent professional from requesting access to themselves
    if (req.user.id === patientId) {
      return res.status(400).json({
        success: false,
        message: "Cannot request access to your own records",
      });
    }

    // Check if consent already exists
    const existingConsent = await Consent.findOne({
      patientId,
      professionalId: req.user.id,
      status: { $in: ["pending", "approved"] },
    });

    if (existingConsent) {
      return res.status(400).json({
        success: false,
        message: "Consent already requested or approved",
      });
    }

    const consent = await Consent.create({
      patientId,
      professionalId: req.user.id,
      consentType,
      recordTypesAllowed: recordTypesAllowed || [],
      accessScope: accessScope || "read_only",
      expiryDate,
      reason,
      status: "pending",
    });

    // Notify patient of access request
    await Notification.create({
      userId: patientId,
      type: "access_request",
      title: "Medical Record Access Request",
      message: `A healthcare professional has requested access to your medical records. ${
        reason ? `Reason: ${reason}` : ""
      }`,
      relatedEntityId: consent._id,
      relatedEntityType: "consent",
      priority: "high",
      sentVia: ["in_app", "email"],
    });

    res.status(201).json({ success: true, consent });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get pending consent requests for patient
exports.getPendingRequests = async (req, res) => {
  try {
    // expire any old consents before computing
    await expireOldConsents();

    const requests = await Consent.find({
      patientId: req.user.id,
      status: "pending",
    })
      .populate("professionalId", "firstName lastName email")
      .sort({ createdAt: -1 });

    res.json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all consents for patient
exports.getConsents = async (req, res) => {
  try {
    await expireOldConsents();

    const consents = await Consent.find({ patientId: req.user.id })
      .populate("professionalId", "firstName lastName email")
      .sort({ createdAt: -1 });

    res.json({ success: true, consents });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get consents for professional (records they have access to)
exports.getMyConsents = async (req, res) => {
  try {
    await expireOldConsents();

    const now = new Date();
    const consents = await Consent.find({
      professionalId: req.user.id,
      status: "approved",
      $or: [{ expiryDate: { $exists: false } }, { expiryDate: { $gt: now } }],
    })
      .populate("patientId", "firstName lastName email")
      .sort({ createdAt: -1 });

    res.json({ success: true, consents });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Approve consent request
exports.approveConsent = async (req, res) => {
  try {
    const { id } = req.params;

    const consent = await Consent.findById(id);
    if (!consent) {
      return res
        .status(404)
        .json({ success: false, message: "Consent request not found" });
    }

    if (String(consent.patientId) !== req.user.id) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    if (consent.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending requests can be approved",
      });
    }

    consent.status = "approved";
    consent.approvedAt = Date.now();
    await consent.save();

    // Notify professional of approval
    await Notification.create({
      userId: consent.professionalId,
      type: "general",
      title: "Access Approved",
      message:
        "Your request to access patient medical records has been approved",
      relatedEntityId: consent._id,
      relatedEntityType: "consent",
      priority: "medium",
      sentVia: ["in_app", "email"],
    });

    res.json({ success: true, consent });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// expose helper so other modules (e.g. record controller) can expire records lazily
exports.expireOldConsents = expireOldConsents;

// Reject consent request
exports.rejectConsent = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const consent = await Consent.findById(id);
    if (!consent) {
      return res
        .status(404)
        .json({ success: false, message: "Consent request not found" });
    }

    if (String(consent.patientId) !== req.user.id) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    if (consent.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending requests can be rejected",
      });
    }

    consent.status = "rejected";
    consent.reason = reason || "Rejected by patient";
    await consent.save();

    // Notify professional of rejection
    await Notification.create({
      userId: consent.professionalId,
      type: "general",
      title: "Access Denied",
      message: "Your request to access patient medical records has been denied",
      relatedEntityId: consent._id,
      relatedEntityType: "consent",
      priority: "medium",
      sentVia: ["in_app", "email"],
    });

    res.json({ success: true, message: "Consent request rejected" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Revoke consent
exports.revokeConsent = async (req, res) => {
  try {
    const { id } = req.params;

    const consent = await Consent.findById(id);
    if (!consent) {
      return res
        .status(404)
        .json({ success: false, message: "Consent not found" });
    }

    if (String(consent.patientId) !== req.user.id) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    consent.status = "revoked";
    consent.revokedAt = Date.now();
    await consent.save();

    // Notify professional of revocation
    await Notification.create({
      userId: consent.professionalId,
      type: "general",
      title: "Access Revoked",
      message: "Patient has revoked your access to their medical records",
      relatedEntityId: consent._id,
      relatedEntityType: "consent",
      priority: "medium",
      sentVia: ["in_app", "email"],
    });

    res.json({ success: true, message: "Consent revoked" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
