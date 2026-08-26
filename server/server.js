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
    // 0. Free up ADMIN001 if held by another user
    const existingAdmin001 = await User.findOne({ employeeId: 'ADMIN001', email: { $ne: 'shivamthakur12012@gmail.com' } });
    if (existingAdmin001) {
      console.log('Renaming old ADMIN001 user to MGR001 to prevent duplicate key constraint...');
      existingAdmin001.employeeId = 'MGR001';
      existingAdmin001.role = 'Manager';
      await existingAdmin001.save();
    }

    // 1. Find if a user with shivamthakur12012@gmail.com exists
    let shivam = await User.findOne({ email: 'shivamthakur12012@gmail.com' }).select('+password');
    if (!shivam) {
      console.log('Seeding Shivam Kumar as the sole Admin user...');
      shivam = await User.create({
        fullName: 'Shivam Kumar',
        employeeId: 'ADMIN001',
        email: 'shivamthakur12012@gmail.com',
        password: 'Shivam@123321',
        role: 'Admin',
        status: 'Active',
        phone: '1234567890',
        designation: 'Managing Director'
      });
      console.log('Sole Admin seeded successfully. Credentials: shivamthakur12012@gmail.com / Shivam@123321');
    } else {
      let modified = false;
      if (shivam.role !== 'Admin') {
        shivam.role = 'Admin';
        modified = true;
      }
      if (shivam.employeeId !== 'ADMIN001') {
        shivam.employeeId = 'ADMIN001';
        modified = true;
      }
      if (shivam.status !== 'Active') {
        shivam.status = 'Active';
        modified = true;
      }
      const isPasswordMatch = await shivam.matchPassword('Shivam@123321');
      if (!isPasswordMatch) {
        shivam.password = 'Shivam@123321';
        modified = true;
        console.log('Updating Admin password to match Shivam@123321...');
      }
      if (modified) {
        await shivam.save();
        console.log('Updated shivamthakur12012@gmail.com role/employeeId/credentials.');
      }
    }

    // 2. Demote all other Admin users in the database to 'Manager'
    const demoted = await User.updateMany(
      { email: { $ne: 'shivamthakur12012@gmail.com' }, role: 'Admin' },
      { $set: { role: 'Manager' } }
    );
    if (demoted.modifiedCount > 0) {
      console.log(`Demoted ${demoted.modifiedCount} unauthorized admin user(s) to Manager.`);
    }
  } catch (err) {
    console.error('Error enforcing single Admin user:', err.message);
  }
}

function scheduleHolidayCheck() {
  const checkHoliday = async () => {
    try {
      const todayStr = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
      
      const Holiday = require('./models/Holiday');
      const holiday = await Holiday.findOne({ date: todayStr });
      if (holiday) {
        // Check if we already sent a holiday greeting notification today
        const Notification = require('./models/Notification');
        const alreadySent = await Notification.findOne({
          title: `Happy Holiday: ${holiday.name}!`,
          createdAt: {
            $gte: new Date(new Date().setHours(0, 0, 0, 0)),
            $lt: new Date(new Date().setHours(23, 59, 59, 999))
          }
        });
        if (alreadySent) {
          console.log(`[Holiday Greeting] Greeting for "${holiday.name}" already sent today. Skipping to prevent duplicate.`);
          return;
        }

        console.log(`[Holiday Greeting] Today is a holiday: "${holiday.name}". Sending greeting to all employees.`);
        const { sendNotification } = require('./utils/notifications');
        await sendNotification(
          'All',
          `Happy Holiday: ${holiday.name}!`,
          `Wishing all employees a wonderful and restful "${holiday.name}" holiday!\n\nWarm regards,\nManagement Team`,
          'Holiday'
        );
      }
    } catch (err) {
      console.error('Error checking daily holiday status:', err.message);
    }
  };

  // Run immediately on database connection
  checkHoliday();

  // Schedule to run daily at 9:00 AM
  const getMsUntil9AM = () => {
    const now = new Date();
    const target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0, 0, 0);
    if (now.getTime() >= target.getTime()) {
      target.setDate(target.getDate() + 1);
    }
    return target.getTime() - now.getTime();
  };

  setTimeout(function runDaily() {
    checkHoliday();
    setInterval(checkHoliday, 24 * 60 * 60 * 1000);
  }, getMsUntil9AM());
}

mongoose.connection.on('connected', () => {
  seedAdmin();
  scheduleHolidayCheck();
});

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

if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Attendance Server running on port ${PORT}`);
  });
}

module.exports = app;
