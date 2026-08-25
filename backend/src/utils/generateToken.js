const jwt = require('jsonwebtoken');

const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || 'super_secret_course_system_jwt_key_2026',
    {
      expiresIn: process.env.JWT_EXPIRE || '30d'
    }
  );
};

module.exports = generateToken;
