const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const User = require('./models/User');
const mongoose = require('mongoose');

const app = express();

async function seedAdmin() {
  try {
    const adminCount = await User.countDocuments({ role: 'Admin' });
    if (adminCount === 0) {
      console.log('Seeding default Admin user...');
      await User.create({
        fullName: 'System Administrator',
        employeeId: 'ADMIN001',
        email: 'admin@attendance.com',
        password: 'adminpassword123',
        role: 'Admin',
        status: 'Active',
        phone: '1234567890',
        designation: 'IT Admin'
      });
      console.log('Default Admin seeded successfully. Credentials: admin@attendance.com / adminpassword123');
    } else {
      console.log(`Admin user verified in DB (${adminCount} admin(s) present).`);
    }
  } catch (err) {
    console.error('Error seeding admin user:', err.message);
  }
}

mongoose.connection.on('connected', seedAdmin);

// Connect to Database (with auto-retry on failure)
connectDB();

// Middleware
app.use(helmet());

// CORS configuration (allow requests from client)
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Define Static Folder for uploaded documents/photos
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
app.use('/uploads', express.static(uploadsDir));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/departments', require('./routes/departments'));
app.use('/api/employees', require('./routes/employees'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/leaves', require('./routes/leaves'));
app.use('/api/holidays', require('./routes/holidays'));
app.use('/api/events', require('./routes/events'));
app.use('/api/announcements', require('./routes/announcements'));

// Base Route
app.get('/', (req, res) => {
  res.json({ message: 'Attendance Management System API is running...' });
});

// Centralized Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Attendance Server running on port ${PORT}`);
});
