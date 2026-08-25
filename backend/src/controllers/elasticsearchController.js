const esService = require('../services/elasticsearchService');
const Course = require('../models/Course');

// @desc    Check Elasticsearch Health & Connection status
// @route   GET /api/es/health
// @access  Public
exports.getHealth = async (req, res, next) => {
  try {
    const health = await esService.checkHealth();
    res.status(200).json({
      success: true,
      message: 'Elasticsearch health status checked',
      data: health
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Sync all MongoDB courses to Elasticsearch Index
// @route   POST /api/es/sync
// @access  Private/Admin
exports.syncCourses = async (req, res, next) => {
  try {
    const courses = await Course.find().populate('category', 'name');
    const result = await esService.syncCourses(courses);

    res.status(200).json({
      success: true,
      message: `Successfully indexed ${result.syncedCount} courses into Elasticsearch`,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Elasticsearch sync failed. Make sure Elasticsearch is running at localhost:9200.',
      error: { code: 'ES_SYNC_ERROR' }
    });
  }
};

// @desc    Search courses using Elasticsearch Engine
// @route   GET /api/es/search?q=...
// @access  Public
exports.searchCourses = async (req, res, next) => {
  try {
    const { q, level } = req.query;
    const searchResult = await esService.searchCourses(q, { level });

    res.status(200).json({
      success: true,
      message: searchResult.isElasticActive 
        ? 'Retrieved search results from Elasticsearch index' 
        : 'Elasticsearch offline - Fallback active',
      data: searchResult
    });
  } catch (error) {
    next(error);
  }
};
