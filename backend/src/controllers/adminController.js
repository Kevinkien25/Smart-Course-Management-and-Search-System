const Course = require('../models/Course');
const User = require('../models/User');
const Enrollment = require('../models/Enrollment');
const SearchHistory = require('../models/SearchHistory');

// @desc    Get dashboard aggregated system statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getAdminStats = async (req, res, next) => {
  try {
    const totalCourses = await Course.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalEnrollments = await Enrollment.countDocuments();
    const totalSearches = await SearchHistory.countDocuments();

    res.status(200).json({
      success: true,
      message: 'Admin statistics retrieved successfully',
      data: {
        totalCourses,
        totalUsers,
        totalEnrollments,
        totalSearches
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get list of all registered users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Users list retrieved successfully',
      data: users
    });
  } catch (error) {
    next(error);
  }
};
