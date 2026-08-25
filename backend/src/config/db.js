const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/course_management_db');
    console.log(`[MongoDB Connected]: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB Connection Error]: ${error.message}`);
    // If local MongoDB isn't running, log warning but don't hard exit in development
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
