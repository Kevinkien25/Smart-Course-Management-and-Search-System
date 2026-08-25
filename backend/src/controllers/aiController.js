const aiService = require('../services/aiService');

// @desc    Get AI Search Intent Analysis & Keyword Suggestions
// @route   GET /api/ai/search-intent?q=...
// @access  Public
exports.getSearchIntent = async (req, res, next) => {
  try {
    const { q } = req.query;
    const analysis = await aiService.analyzeSearchIntent(q || '');

    res.status(200).json({
      success: true,
      message: 'AI Search Intent analyzed successfully',
      data: analysis
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get AI Generated Summary for Course Details
// @route   POST /api/ai/summarize
// @access  Public
exports.getCourseSummary = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide course title and description',
        error: { code: 'MISSING_FIELDS' }
      });
    }

    const summary = await aiService.summarizeCourse(title, description);

    res.status(200).json({
      success: true,
      message: 'Course summarized by AI successfully',
      data: summary
    });
  } catch (error) {
    next(error);
  }
};
