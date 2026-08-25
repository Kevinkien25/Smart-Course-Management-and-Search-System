const express = require('express');
const router = express.Router();
const { getHealth, syncCourses, searchCourses } = require('../controllers/elasticsearchController');
const { authenticateUser, authorizeAdmin } = require('../middleware/authMiddleware');

router.get('/health', getHealth);
router.get('/search', searchCourses);
router.post('/sync', authenticateUser, authorizeAdmin, syncCourses);

module.exports = router;
