const express = require('express');
const router = express.Router();
const {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse
} = require('../controllers/courseController');
const { authenticateUser, authorizeAdmin } = require('../middleware/authMiddleware');

router.get('/', getCourses);
router.get('/:id', getCourseById);
router.post('/', authenticateUser, authorizeAdmin, createCourse);
router.put('/:id', authenticateUser, authorizeAdmin, updateCourse);
router.delete('/:id', authenticateUser, authorizeAdmin, deleteCourse);

module.exports = router;
