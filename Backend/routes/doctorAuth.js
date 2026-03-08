const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Doctor = require('../models/Doctor');

// ✅ Doctor Login API
router.post('/doctor-login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await Doctor.findOne({ email });
    if (!doctor) return res.status(400).json({ msg: "Doctor records not found" });

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials" });

    res.json({
      doctor: { id: doctor._id, name: doctor.name, email: doctor.email, role: 'doctor' }
    });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
});
// ✅ Update Appointment Status API
router.put('/update-appointment-status/:id', async (req, res) => {
  try {
    const { status, doctorMessage } = req.body;
    const { id } = req.params;

    // Check if status is valid
    if (!['Confirmed', 'Rejected'].includes(status)) {
      return res.status(400).json({ msg: "Invalid status" });
    }

    const Appointment = require('../models/Appointment');

    // Include doctor message if provided
    const updateData = { status };
    if (doctorMessage !== undefined) {
      updateData.doctorMessage = doctorMessage;
    }

    const appointment = await Appointment.findByIdAndUpdate(id, updateData, { new: true });

    if (!appointment) return res.status(404).json({ msg: "Appointment not found" });

    res.json({ msg: `Appointment ${status}`, appointment });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
});

module.exports = router;