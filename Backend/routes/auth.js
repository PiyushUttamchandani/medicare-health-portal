const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Service = require('../models/Service');
const Appointment = require('../models/Appointment');
const Message = require('../models/Message'); // ✅ Added Message model
const ContactMessage = require('../models/ContactMessage'); // ✅ Added Patient contact model


// ==========================================
// 📁 MULTER STORAGE SETUP
// ==========================================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// ==========================================
// 🩺 DOCTOR MANAGEMENT
// ==========================================

router.post('/admin-add-doctor', upload.single('image'), async (req, res) => {
  try {
    const { name, email, password, speciality, experience } = req.body;
    let doctor = await Doctor.findOne({ email });
    if (doctor) return res.status(400).json({ msg: "Doctor already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const imagePath = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : "";

    const newDoctor = new Doctor({
      name, email, password: hashedPassword, specialization: speciality, experience, image: imagePath
    });

    await newDoctor.save();
    res.status(201).json({ msg: "Doctor Registered Successfully!" });
  } catch (err) {
    res.status(500).json({ msg: "Backend Error: Check uploads folder" });
  }
});

router.get('/all-doctors', async (req, res) => {
  try {
    const doctors = await Doctor.find().select('-password');
    res.json(doctors);
  } catch (err) { res.status(500).send("Server Error"); }
});

// ==========================================
// 👤 PATIENT / USER MANAGEMENT
// ==========================================

router.get('/all-users', async (req, res) => {
  try {
    const users = await User.find({ role: 'patient' }).select('-password');
    res.json(users);
  } catch (err) { res.status(500).send("Server Error"); }
});

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user = new User({ name, email, password: hashedPassword, role: 'patient' });
    await user.save();
    res.status(201).json({ msg: "User registered" });
  } catch (err) { res.status(500).json({ msg: "Server Error" }); }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid Credentials" });
    if (user.isBlocked) return res.status(403).json({ msg: "Account blocked" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials" });

    res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) { res.status(500).json({ msg: "Server Error" }); }
});

// ✅ FIX: Admin Add User Route (Validation added)
router.post('/admin-add-user', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ msg: "Please fill all fields" });

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ name, email, password: hashedPassword, role: 'patient' });
    await newUser.save();
    res.status(201).json({ msg: "User Created Successfully!" });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
});

// ==========================================
// 🏥 SERVICES & APPOINTMENTS
// ==========================================

router.get('/all-services', async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (err) { res.status(500).send("Server Error"); }
});

// ✅ FIX: Book Appointment (Added detail logging)
router.post('/book-appointment', async (req, res) => {
  try {
    console.log("Incoming Booking Data:", req.body); // Terminal mein check karein

    // Check missing fields
    const { patientId, doctorId, date, time } = req.body;
    if (!patientId || !date || !time) {
      return res.status(400).json({ msg: "Missing essential booking details" });
    }

    const newBooking = new Appointment(req.body);
    await newBooking.save();
    res.status(201).json({ msg: "Appointment Booked!" });
  } catch (err) {
    console.error("Booking Error Detail:", err);
    res.status(500).json({ msg: "Booking Error: Check Database Schema" });
  }
});

// ✅ Get Booked Slots for a Specific Doctor on a Specific Date
router.get('/booked-slots', async (req, res) => {
  try {
    const { doctorId, date } = req.query;
    if (!doctorId || !date) {
      return res.status(400).json({ msg: "doctorId and date are required" });
    }

    // Sirf woh appointments jo Rejected nahi hain, unka time fetch karenge
    const appointments = await Appointment.find({ doctorId, date, status: { $ne: 'Rejected' } });
    const bookedTimeSlots = appointments.map(app => app.time);

    res.json(bookedTimeSlots);
  } catch (err) {
    console.error("Error fetching booked slots:", err);
    res.status(500).json({ msg: "Server Error" });
  }
});

// ✅ Get Appointments for a Specific Patient
router.get('/patient-appointments/:patientId', async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.params.patientId })
      .sort({ createdAt: -1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching history" });
  }
});

// ==========================================
// 🩺 DOCTOR PORTAL
// ==========================================

router.post('/doctor-login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await Doctor.findOne({ email });

    if (!doctor) return res.status(400).json({ msg: "Doctor not found" });

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials" });

    res.json({
      doctor: { id: doctor._id, name: doctor.name, email: doctor.email, role: 'doctor' }
    });
  } catch (err) { res.status(500).json({ msg: "Server Error" }); }
});

// ✅ DOCTOR TO ADMIN MESSAGE ROUTE
router.post('/message-admin', async (req, res) => {
  try {
    const { doctorId, doctorName, message } = req.body;
    if (!doctorId || !doctorName || !message) {
      return res.status(400).json({ msg: "Please provide all details" });
    }

    const newMessage = new Message({
      senderId: doctorId,
      senderName: doctorName,
      message
    });

    await newMessage.save();
    res.status(201).json({ msg: "Message sent to Admin successfully!" });
  } catch (err) {
    console.error("Message Error:", err);
    res.status(500).json({ msg: "Failed to send message" });
  }
});

// ✅ GET ALL MESSAGES FOR ADMIN
router.get('/all-messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch messages" });
  }
});

// ✅ DELETE MESSAGE
router.delete('/delete-message/:id', async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) return res.status(404).json({ msg: "Message not found" });
    res.json({ msg: "Message deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Failed to delete message" });
  }
});

// ✅ PATIENT CONTACT MESSAGE ROUTE (Public)
router.post('/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ msg: "Please provide all details" });
    }

    const newMessage = new ContactMessage({ name, email, message });
    await newMessage.save();
    res.status(201).json({ msg: "Message sent successfully!" });
  } catch (err) {
    console.error("Contact Message Error:", err);
    res.status(500).json({ msg: "Failed to send message" });
  }
});

// ✅ GET ALL PATIENT MESSAGES FOR ADMIN
router.get('/all-contact-messages', async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch messages" });
  }
});

// ✅ DELETE PATIENT MESSAGE
router.delete('/delete-contact-message/:id', async (req, res) => {
  try {
    const message = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!message) return res.status(404).json({ msg: "Message not found" });
    res.json({ msg: "Message deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Failed to delete message" });
  }
});

router.get('/doctor-appointments/:doctorId', async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctorId: req.params.doctorId }).sort({ createdAt: -1 });
    res.json(appointments);
  } catch (err) { res.status(500).json({ msg: "Error fetching appointments" }); }
});

// ==========================================
// 🗑️ DELETE ROUTES
// ==========================================
router.delete('/delete-doctor/:id', async (req, res) => {
  try {
    await Doctor.findByIdAndDelete(req.params.id);
    res.json({ msg: "Doctor removed" });
  } catch (err) { res.status(500).send("Server Error"); }
});

router.delete('/delete-user/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: "User deleted" });
  } catch (err) { res.status(500).send("Server Error"); }
});

// ✅ Update Patient Profile
router.put('/update-profile/:id', async (req, res) => {
  try {
    const { name, email, age, gender, weight, height, location, bloodGroup, allergies, medications } = req.body;

    // User ko find karke update karein
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, age, gender, weight, height, location, bloodGroup, allergies, medications },
      { new: true } // Updated data wapas milega
    ).select('-password');

    res.json({ msg: "Profile Updated!", user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;  