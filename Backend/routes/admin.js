const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Doctor = require('../models/Doctor');

// ✅ Admin: Add New Doctor
router.post('/add-doctor', async (req, res) => {
  try {
    const { name, email, password, specialization } = req.body;
    let doctor = await Doctor.findOne({ email });
    if (doctor) return res.status(400).json({ msg: "Doctor already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    doctor = new Doctor({ name, email, password: hashedPassword, specialization });
    await doctor.save();
    res.status(201).json({ msg: "Doctor Registered Successfully by Admin!" });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

module.exports = router;