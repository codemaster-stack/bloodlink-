const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Donor",
    required: true,
  },
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital",
    required: true,
  },
  appointmentDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "rescheduled", "cancelled"],
    default: "pending",
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

module.exports = mongoose.model("Appointment", appointmentSchema);
