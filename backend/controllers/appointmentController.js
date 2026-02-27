const Appointment = require("../models/Appointment");
const User = require("../models/User");
const Availability = require("../models/Availability");
const Feedback = require("../models/Feedback");

// Get All Appointments (Public)
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("patient", "firstName lastName email")
      .populate("doctor", "firstName lastName email specialization")
      .sort({ date: -1 })
      .limit(50);

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Book Appointment (Patient)
exports.bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, reason } = req.body;

    if (!doctorId || !date || !reason) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Verify doctor exists
    const doctor = await User.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const dateObj = new Date(date);
    const now = new Date();

    // server-side: prevent booking in the past
    if (isNaN(dateObj.getTime()) || dateObj.getTime() <= now.getTime()) {
      return res
        .status(400)
        .json({ message: "Cannot book an appointment in the past" });
    }

    // ensure the requested time falls within doctor's availability for that day and on a 30-min boundary
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const day = dayNames[dateObj.getDay()];

    const toMinutes = (d) => d.getHours() * 60 + d.getMinutes();
    const timeMin = toMinutes(dateObj);

    // find availability ranges for the doctor on that day
    const ranges = await Availability.find({ doctor: doctorId, day });
    let withinAvailability = false;

    for (const r of ranges) {
      const [sh, sm] = r.startTime.split(":").map(Number);
      const [eh, em] = r.endTime.split(":").map(Number);
      const s = sh * 60 + sm;
      const e = eh * 60 + em;

      if (timeMin >= s && timeMin + 30 <= e && (timeMin - s) % 30 === 0) {
        withinAvailability = true;
        break;
      }
    }

    if (!withinAvailability) {
      return res
        .status(400)
        .json({ message: "Selected time is not within doctor's availability" });
    }

    // ensure no existing appointment for the doctor overlaps this 30-min slot
    // Note: rejected or cancelled appointments should not block rebooking
    const slotStart = dateObj;
    const slotEnd = new Date(dateObj);
    slotEnd.setMinutes(slotEnd.getMinutes() + 30);

    const existing = await Appointment.findOne({
      doctor: doctorId,
      date: { $gte: slotStart, $lt: slotEnd },
      status: { $nin: ["rejected", "cancelled"] }, // only block approved/pending, not rejected
    });
    if (existing) {
      return res
        .status(409)
        .json({ message: "Selected slot is already booked" });
    }

    const appointment = await Appointment.create({
      patient: req.user.id,
      doctor: doctorId,
      date: dateObj,
      reason,
    });

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate("patient", "firstName lastName email")
      .populate("doctor", "firstName lastName email specialization");

    res.status(201).json(populatedAppointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Doctor Approve / Reject
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["approved", "rejected", "completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.doctor.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    appointment.status = status;
    await appointment.save();

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate("patient", "firstName lastName email")
      .populate("doctor", "firstName lastName email specialization");

    res.json(populatedAppointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Appointments (Doctor or Patient)
exports.getMyAppointments = async (req, res) => {
  try {
    // debug logging
    console.log("getMyAppointments called for user", req.user.id, req.user.role);

    let query = {};

    if (req.user.role === "professional") {
      query.doctor = req.user.id;
    } else {
      query.patient = req.user.id;
    }

    console.log("Appointment query", query);

    let appointments = await Appointment.find(query)
      .populate("patient", "firstName lastName email")
      .populate("doctor", "firstName lastName email specialization")
      .sort({ date: -1 });

    // attach feedback flag to each appointment
    const feedbacks = await Feedback.find({
      appointment: { $in: appointments.map((a) => a._id) },
    }).select("appointment");
    const feedbackSet = new Set(feedbacks.map((f) => String(f.appointment)));
    appointments = appointments.map((a) => {
      const obj = a.toObject();
      obj.hasFeedback = feedbackSet.has(String(a._id));
      return obj;
    });

    console.log(`returning ${appointments.length} appointments`);
    res.json(appointments);
  } catch (error) {
    console.error("getMyAppointments error", error);
    res.status(500).json({ message: error.message });
  }
};
