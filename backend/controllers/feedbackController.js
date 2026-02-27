const Feedback = require("../models/Feedback");
const Appointment = require("../models/Appointment");

exports.addFeedback = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return res
        .status(400)
        .json({ message: "Rating and comment are required" });
    }

    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    const appointment = await Appointment.findById(req.params.appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.patient.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (appointment.status !== "completed") {
      return res
        .status(400)
        .json({ message: "Can only give feedback for completed appointments" });
    }

    // Check if feedback already exists
    const existingFeedback = await Feedback.findOne({
      appointment: appointment._id,
    });

    if (existingFeedback) {
      return res
        .status(400)
        .json({ message: "Feedback already submitted for this appointment" });
    }

    const feedback = await Feedback.create({
      appointment: appointment._id,
      patient: req.user.id,
      doctor: appointment.doctor,
      rating,
      comment,
    });

    const populatedFeedback = await Feedback.findById(feedback._id)
      .populate("patient", "firstName lastName email")
      .populate("doctor", "firstName lastName email");

    res.status(201).json(populatedFeedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDoctorFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find({
      doctor: req.params.doctorId,
    })
      .populate("patient", "firstName lastName email")
      .populate("appointment", "date reason")
      .sort({ createdAt: -1 });

    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFeedbackByAppointment = async (req, res) => {
  try {
    const feedback = await Feedback.findOne({
      appointment: req.params.appointmentId,
    })
      .populate("patient", "firstName lastName email")
      .populate("doctor", "firstName lastName email")
      .populate("appointment", "date reason status");

    if (!feedback) {
      return res.status(404).json({ message: "No feedback found" });
    }

    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
