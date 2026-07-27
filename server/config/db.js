const mongoose = require('mongoose');
const dns = require('dns');

// Force Node.js to use public DNS servers (8.8.8.8, 1.1.1.1) to avoid Windows local SRV query ECONNREFUSED issues
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  console.warn('Could not set custom DNS servers:', e.message);
}

const connectDB = async () => {
  let uri = process.env.ATTENDANCE_MONGODB_URI || process.env.MONGODB_URI;
  console.log('Attempting MongoDB Attendance connection...');

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
    });
    console.log(`MongoDB Connected (Attendance DB: ${conn.connection.name}): ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    // If SRV lookup failed, attempt fallback to direct shard connection string
    if (error.message.includes('ECONNREFUSED') || error.message.includes('querySrv')) {
      console.log('Attempting direct shard connection fallback...');
      const fallbackUri = `mongodb://quick-chat-user:nFZ2PzGC927xsTYM@ac-vywfgyu-shard-00-00.egaim3l.mongodb.net:27017,ac-vywfgyu-shard-00-01.egaim3l.mongodb.net:27017,ac-vywfgyu-shard-00-02.egaim3l.mongodb.net:27017/Attendance?tls=true&replicaSet=atlas-cenyc6-shard-0&authSource=admin&retryWrites=true&w=majority`;
      try {
        const conn = await mongoose.connect(fallbackUri, {
          serverSelectionTimeoutMS: 15000,
          socketTimeoutMS: 45000,
        });
        console.log(`MongoDB Connected via Shard Fallback (Attendance DB: ${conn.connection.name}): ${conn.connection.host}`);
        return;
      } catch (fallbackError) {
        console.error(`Fallback connection also failed: ${fallbackError.message}`);
      }
    }
    console.log('Retrying in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};

module.exports = connectDB;
