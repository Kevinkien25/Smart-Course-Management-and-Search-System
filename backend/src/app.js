const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check / Root Endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Course Management & Smart Search System API is running',
    data: {
      version: '1.0.0',
      timestamp: new Date().toISOString()
    }
  });
});

const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const searchRoutes = require('./routes/searchRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const searchHistoryRoutes = require('./routes/searchHistoryRoutes');
const adminRoutes = require('./routes/adminRoutes');
const aiRoutes = require('./routes/aiRoutes');

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/search-history', searchHistoryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);

// Global Error Handler Middleware
app.use(errorHandler);

module.exports = app;
