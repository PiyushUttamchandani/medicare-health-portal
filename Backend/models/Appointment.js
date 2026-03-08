const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true }, // ✅ Doctor se link kiya
  patientName: String,
  doctorName: String,
  service: String,
  date: String,
  time: String,
  phone: String,
  status: { type: String, default: "Pending" }, // Pending, Confirmed, Cancelled
  doctorMessage: { type: String, default: "" } // ✅ Naya field for doctor to patient message
}, { timestamps: true });

module.exports = mongoose.model('Appointment', AppointmentSchema);