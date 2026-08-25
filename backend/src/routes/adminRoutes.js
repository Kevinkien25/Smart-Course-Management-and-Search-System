const express = require('express');
const router = express.Router();
const { getAdminStats, getAllUsers } = require('../controllers/adminController');
const { authenticateUser, authorizeAdmin } = require('../middleware/authMiddleware');

router.get('/stats', authenticateUser, authorizeAdmin, getAdminStats);
router.get('/users', authenticateUser, authorizeAdmin, getAllUsers);

module.exports = router;
