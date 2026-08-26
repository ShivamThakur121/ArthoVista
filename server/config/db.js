const mongoose = require('mongoose');
const dns = require('dns');

// Force Node.js to use public DNS servers (8.8.8.8, 1.1.1.1) to avoid Windows local SRV query ECONNREFUSED issues
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  console.warn('Could not set custom DNS servers:', e.message);
}

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  let uri = process.env.ATTENDANCE_MONGODB_URI || process.env.MONGODB_URI;
  console.log('Attempting MongoDB connection to Official_ArthoVista...');

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
    });
    console.log(`MongoDB Connected (Database: ${conn.connection.name}): ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    console.log('Retrying in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};

module.exports = connectDB;
