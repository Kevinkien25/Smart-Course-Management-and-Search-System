// Global Error Handling Middleware
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for development
  console.error('[Error Handler]:', err);

  // Mongoose Bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found with ID of ${err.value}`;
    return res.status(404).json({
      success: false,
      message,
      error: { code: 'INVALID_ID', details: message }
    });
  }

  // Mongoose Duplicate Key (e.g. Email)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    const message = `Duplicate value entered for ${field}`;
    return res.status(400).json({
      success: false,
      message: `The ${field} '${err.keyValue[field]}' is already in use.`,
      error: { code: 'DUPLICATE_KEY', field, details: message }
    });
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      error: { code: 'VALIDATION_ERROR', details: message }
    });
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid authorization token',
      error: { code: 'UNAUTHORIZED' }
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Authorization token expired',
      error: { code: 'TOKEN_EXPIRED' }
    });
  }

  // Default Fallback Server Error
  res.status(err.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
    error: process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}
  });
};

module.exports = errorHandler;
