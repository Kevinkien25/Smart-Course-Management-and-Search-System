const express = require('express');
const router = express.Router();
const {
  enrollCourse,
  getUserEnrollments,
  getEnrollmentById
} = require('../controllers/enrollmentController');
const { authenticateUser } = require('../middleware/authMiddleware');

router.post('/', authenticateUser, enrollCourse);
router.get('/', authenticateUser, getUserEnrollments);
router.get('/:id', authenticateUser, getEnrollmentById);

module.exports = router;
