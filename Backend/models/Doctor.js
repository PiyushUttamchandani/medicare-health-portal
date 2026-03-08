const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "doctor" },
  specialization: { type: String, required: true },
  experience: { type: String, required: true },
  image: { type: String, default: "" }, // PC se upload hone wali image ka path yahan ayega
  isBlocked: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Doctor', DoctorSchema);