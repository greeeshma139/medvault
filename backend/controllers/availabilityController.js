const Availability = require("../models/Availability");
const Appointment = require("../models/Appointment");

// Doctor sets availability
exports.setAvailability = async (req, res) => {
  try {
    // defensive: ensure authenticated user data present
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Authentication required" });
    }
    // only professionals may set availability
    if (req.user.role !== "professional") {
      return res.status(403).json({ message: "Only professionals can set availability" });
    }
    const { day, startTime, endTime } = req.body;

    if (!day || !startTime || !endTime) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // validate times
    const toMinutes = (t) => {
      const [h, m] = t.split(":").map(Number);
      return h * 60 + m;
    };

    const s = toMinutes(startTime);
    const e = toMinutes(endTime);

    if (s >= e) {
      return res
        .status(400)
        .json({ message: "startTime must be before endTime" });
    }

    // prevent overlapping slots for same doctor and day
    const existingOverlaps = await Availability.findOne({
      doctor: req.user.id,
      day,
      $or: [
        {
          $and: [
            { startTime: { $lte: startTime } },
            { endTime: { $gt: startTime } },
          ],
        },
        {
          $and: [
            { startTime: { $lt: endTime } },
            { endTime: { $gte: endTime } },
          ],
        },
        {
          $and: [
            { startTime: { $gte: startTime } },
            { endTime: { $lte: endTime } },
          ],
        },
      ],
    });

    if (existingOverlaps) {
      return res
        .status(409)
        .json({ message: "Slot overlaps existing availability" });
    }

    const availability = await Availability.create({
      doctor: req.user.id,
      day,
      startTime,
      endTime,
    });

    res.status(201).json(availability);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update availability slot
exports.updateAvailability = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const { id } = req.params;
    const { day, startTime, endTime } = req.body;

    const slot = await Availability.findById(id);
    if (!slot)
      return res.status(404).json({ message: "Availability slot not found" });
    if (slot.doctor.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    // validate times if provided
    const toMinutes = (t) => {
      const [h, m] = t.split(":").map(Number);
      return h * 60 + m;
    };

    if (startTime && endTime) {
      const s = toMinutes(startTime);
      const e = toMinutes(endTime);
      if (s >= e)
        return res
          .status(400)
          .json({ message: "startTime must be before endTime" });
      const duration = e - s;
      if (duration % 30 !== 0)
        return res.status(400).json({
          message: "Time slot duration must be a multiple of 30 minutes",
        });
    }

    if (day) slot.day = day;
    if (startTime) slot.startTime = startTime;
    if (endTime) slot.endTime = endTime;
    slot.updatedAt = Date.now();
    await slot.save();

    res.json(slot);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete availability slot
exports.deleteAvailability = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const { id } = req.params;
    const slot = await Availability.findById(id);
    if (!slot)
      return res.status(404).json({ message: "Availability slot not found" });
    if (slot.doctor.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized to delete this slot" });
    await slot.remove();
    res.json({ message: "Availability slot removed" });
  } catch (error) {
    console.error('Error deleting availability:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get doctor availability (returns 30-min slots). Optional query `date=YYYY-MM-DD` filters slots for that date and marks booked slots.
exports.getDoctorAvailability = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query; // optional: YYYY-MM-DD

    // fetch all availability ranges for doctor
    const availRanges = await Availability.find({ doctor: doctorId }).sort({
      day: 1,
    });

    // helper: convert hh:mm to minutes
    const toMinutes = (t) => {
      const [h, m] = t.split(":").map(Number);
      return h * 60 + m;
    };

    const slots = [];

    // If a specific date provided, compute booked slots for that date
    let appointmentsOnDate = [];
    let targetDateObj = null;
    if (date) {
      targetDateObj = new Date(date);
      // normalize to midnight UTC/local behavior depends on input; we'll use start/end range
      const dayStart = new Date(targetDateObj);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(targetDateObj);
      dayEnd.setHours(23, 59, 59, 999);

      // Only fetch approved/pending appointments; rejected/cancelled slots become available for rebooking
      appointmentsOnDate = await Appointment.find({
        doctor: doctorId,
        date: { $gte: dayStart, $lte: dayEnd },
        status: { $nin: ["rejected", "cancelled"] }, // exclude rejected/cancelled from blocking slots
      }).select("date patient status");
    }

    // If a specific date is requested, restrict availability ranges to that weekday
    let filteredRanges = availRanges;
    if (targetDateObj) {
      const weekdayNames = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const weekday = weekdayNames[targetDateObj.getDay()];
      filteredRanges = availRanges.filter(
        (r) => String(r.day).toLowerCase() === String(weekday).toLowerCase(),
      );
    }

    // If no specific date requested, return the raw availability ranges
    if (!targetDateObj) {
      return res.json(availRanges);
    }

    // for each availability range, split into 30-min slots
    for (const r of filteredRanges) {
      const s = toMinutes(r.startTime);
      const e = toMinutes(r.endTime);

      for (let t = s; t < e; t += 30) {
        const slotStartMin = t;
        const slotEndMin = t + 30;

        const slot = {
          availabilityId: r._id,
          doctor: r.doctor,
          day: r.day,
          startTime: `${String(Math.floor(slotStartMin / 60)).padStart(2, "0")}:${String(slotStartMin % 60).padStart(2, "0")}`,
          endTime: `${String(Math.floor(slotEndMin / 60)).padStart(2, "0")}:${String(slotEndMin % 60).padStart(2, "0")}`,
          available: true,
        };

        // if date provided, compute actual Date objects and check if booked
        if (targetDateObj) {
          const slotStart = new Date(targetDateObj);
          slotStart.setHours(Math.floor(slotStartMin / 60), slotStartMin % 60, 0, 0);
          const slotEnd = new Date(targetDateObj);
          slotEnd.setHours(Math.floor(slotEndMin / 60), slotEndMin % 60, 0, 0);

          // mark unavailable if an appointment exists that overlaps the slot start
          const isBooked = appointmentsOnDate.some((a) => {
            const ad = new Date(a.date);
            return ad.getTime() >= slotStart.getTime() && ad.getTime() < slotEnd.getTime();
          });

          slot.available = !isBooked;
          slot.date = date; // echo back requested date
        }

        slots.push(slot);
      }
    }

    // Deduplicate slots by startTime (safety) — in case overlapping availability records existed
    const unique = [];
    const seen = new Set();
    for (const sl of slots) {
      const key = `${sl.date || ""}_${sl.startTime}`;
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(sl);
      }
    }

    res.json(unique);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
