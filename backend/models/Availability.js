const mongoose = require("mongoose");

const availabilitySchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  day: {
    type: String, // Monday, Tuesday etc
    required: true,
  },
  startTime: String,
  endTime: String,
});

module.exports = mongoose.model("Availability", availabilitySchema);
