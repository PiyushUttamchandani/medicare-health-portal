const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // ✅ path module zaroori hai static files ke liye
require('dotenv').config();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// ✅ Static folder for PC Images
// Isse browser http://localhost:5000/uploads/image.jpg ko access kar payega
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Compass Connected Successfully"))
  .catch(err => console.log("❌ MongoDB Connection Error:", err));

// Routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const doctorAuthRoutes = require('./routes/doctorAuth');

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/doctor', doctorAuthRoutes);

// ✅ Global Error Handler (Upload Errors handle karne ke liye)
app.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ msg: "File too large! Max limit 5MB." });
  }
  res.status(500).json({ msg: err.message || "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));