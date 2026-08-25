const express = require('express');
const router = express.Router();
const { getSearchIntent, getCourseSummary } = require('../controllers/aiController');

router.get('/search-intent', getSearchIntent);
router.post('/summarize', getCourseSummary);

module.exports = router;
