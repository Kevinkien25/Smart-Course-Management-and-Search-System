const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - User must be logged in
exports.authenticateUser = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_course_system_jwt_key_2026');

      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User no longer exists',
          error: { code: 'USER_NOT_FOUND' }
        });
      }
      return next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed',
        error: { code: 'UNAUTHORIZED', details: error.message }
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided',
      error: { code: 'NO_TOKEN' }
    });
  }
};

// Optional auth middleware (attaches req.user if token is present, but doesn't block if unauthenticated)
exports.optionalUserAuth = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_course_system_jwt_key_2026');
      req.user = await User.findById(decoded.id).select('-password');
    } catch (error) {
      // Ignore token failure for optional route
      req.user = null;
    }
  }
  next();
};

// Admin role check middleware
exports.authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'Access denied: Admin role required',
    error: { code: 'FORBIDDEN_ROLE' }
  });
};
