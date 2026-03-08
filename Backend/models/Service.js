const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g., "Cardiology"
  description: { type: String, required: true },       // e.g., "Heart Care"
  icon: { type: String, default: "Stethoscope" }       // Lucide icon ka naam
}, { timestamps: true });

module.exports = mongoose.model('Service', ServiceSchema);