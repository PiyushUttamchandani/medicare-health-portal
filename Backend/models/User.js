const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "patient" },
  isBlocked: { type: Boolean, default: false },
  // Clinical Fields
  age: { type: String, default: "" },
  gender: { type: String, default: "" },
  weight: { type: String, default: "" },
  height: { type: String, default: "" },
  bloodGroup: { type: String, default: "" },
  allergies: { type: String, default: "" },
  medications: { type: String, default: "" },
  location: { type: String, default: "" },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);