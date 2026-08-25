const express = require('express');
const router = express.Router();
const { getSearchHistory, deleteSearchHistory } = require('../controllers/searchHistoryController');
const { authenticateUser } = require('../middleware/authMiddleware');

router.get('/', authenticateUser, getSearchHistory);
router.delete('/:id', authenticateUser, deleteSearchHistory);

module.exports = router;
