const Patient = require('../models/Patient');
const User = require('../models/User');

// Get Patient Profile
exports.getPatientProfile = async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.user.id })
      .populate('userId', 'firstName lastName email phoneNumber profilePicture')
      .populate('preferredDoctors');

    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient profile not found' });
    }

    res.status(200).json({
      success: true,
      patient,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Patient Profile
exports.updatePatientProfile = async (req, res) => {
  try {
    const {
      dateOfBirth,
      gender,
      address,
      bloodType,
      allergies,
      emergencyContact,
      insuranceInfo,
    } = req.body;

    let patient = await Patient.findOne({ userId: req.user.id });

    if (!patient) {
      patient = new Patient({
        userId: req.user.id,
        dateOfBirth,
        gender,
        address,
        bloodType,
        allergies,
        emergencyContact,
        insuranceInfo,
      });
    } else {
      if (dateOfBirth) patient.dateOfBirth = dateOfBirth;
      if (gender) patient.gender = gender;
      if (address) patient.address = address;
      if (bloodType) patient.bloodType = bloodType;
      if (allergies) patient.allergies = allergies;
      if (emergencyContact) patient.emergencyContact = emergencyContact;
      if (insuranceInfo) patient.insuranceInfo = insuranceInfo;
      patient.updatedAt = Date.now();
    }

    await patient.save();

    res.status(200).json({
      success: true,
      message: 'Patient profile updated successfully',
      patient,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add Preferred Doctor
exports.addPreferredDoctor = async (req, res) => {
  try {
    const { doctorId } = req.body;

    let patient = await Patient.findOne({ userId: req.user.id });

    if (!patient) {
      patient = new Patient({
        userId: req.user.id,
      });
    }

    if (!patient.preferredDoctors.includes(doctorId)) {
      patient.preferredDoctors.push(doctorId);
      await patient.save();
    }

    res.status(200).json({
      success: true,
      message: 'Doctor added to preferred doctors',
      patient,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
