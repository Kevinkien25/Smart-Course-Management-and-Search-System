const express = require('express');
const router = express.Router();
const { searchCourses } = require('../controllers/searchController');
const { optionalUserAuth } = require('../middleware/authMiddleware');

// Uses optional authentication so logged-in users get search history saved
router.get('/', optionalUserAuth, searchCourses);

module.exports = router;
