const Professional = require('../models/Professional');
const User = require('../models/User');

// Get Professional Profile
exports.getProfessionalProfile = async (req, res) => {
  try {
    const professional = await Professional.findOne({ userId: req.user.id })
      .populate('userId', 'firstName lastName email phoneNumber profilePicture');

    if (!professional) {
      return res.status(404).json({ success: false, message: 'Professional profile not found' });
    }

    res.status(200).json({
      success: true,
      professional,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Professional Profile
exports.updateProfessionalProfile = async (req, res) => {
  try {
    const {
      specialization,
      licenseNumber,
      registrationNumber,
      yearsOfExperience,
      qualifications,
      clinicName,
      clinicAddress,
      consultationFee,
      availability,
    } = req.body;

    let professional = await Professional.findOne({ userId: req.user.id });

    if (!professional) {
      professional = new Professional({
        userId: req.user.id,
        specialization,
        licenseNumber,
        registrationNumber,
        yearsOfExperience,
        qualifications,
        clinicName,
        clinicAddress,
        consultationFee,
        availability,
      });
    } else {
      if (specialization) professional.specialization = specialization;
      if (licenseNumber) professional.licenseNumber = licenseNumber;
      if (registrationNumber) professional.registrationNumber = registrationNumber;
      if (yearsOfExperience) professional.yearsOfExperience = yearsOfExperience;
      if (qualifications) professional.qualifications = qualifications;
      if (clinicName) professional.clinicName = clinicName;
      if (clinicAddress) professional.clinicAddress = clinicAddress;
      if (consultationFee) professional.consultationFee = consultationFee;
      if (availability) professional.availability = availability;
      professional.updatedAt = Date.now();
    }

    await professional.save();

    res.status(200).json({
      success: true,
      message: 'Professional profile updated successfully',
      professional,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Professionals (for patient to find doctors)
exports.getAllProfessionals = async (req, res) => {
  try {
    const { specialization, search } = req.query;

    let filter = {};

    if (specialization) {
      filter.specialization = specialization;
    }

    if (search) {
      const users = await User.find({
        $or: [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
        ],
        role: 'professional',
      });

      const userIds = users.map(u => u._id);
      filter.userId = { $in: userIds };
    }

    const professionals = await Professional.find(filter)
      .populate('userId', 'firstName lastName email phoneNumber profilePicture');

    res.status(200).json({
      success: true,
      professionals,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Professional by ID
exports.getProfessionalById = async (req, res) => {
  try {
    const professional = await Professional.findById(req.params.id)
      .populate('userId', 'firstName lastName email phoneNumber profilePicture');

    if (!professional) {
      return res.status(404).json({ success: false, message: 'Professional not found' });
    }

    res.status(200).json({
      success: true,
      professional,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
