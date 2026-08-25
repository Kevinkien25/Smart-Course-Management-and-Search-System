const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = require('./app');

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`[Server Running]: http://localhost:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`[Unhandled Rejection Error]: ${err.message}`);
  // Keep running in dev mode
});

module.exports = server;
