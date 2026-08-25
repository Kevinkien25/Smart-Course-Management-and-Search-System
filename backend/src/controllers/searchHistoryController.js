const SearchHistory = require('../models/SearchHistory');

// @desc    Get current user's search history
// @route   GET /api/search-history
// @access  Private
exports.getSearchHistory = async (req, res, next) => {
  try {
    const history = await SearchHistory.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      message: 'Search history retrieved successfully',
      data: history
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete single search history item
// @route   DELETE /api/search-history/:id
// @access  Private
exports.deleteSearchHistory = async (req, res, next) => {
  try {
    const historyItem = await SearchHistory.findById(req.params.id);

    if (!historyItem) {
      return res.status(404).json({
        success: false,
        message: 'Search history record not found',
        error: { code: 'NOT_FOUND' }
      });
    }

    if (historyItem.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this search history record',
        error: { code: 'FORBIDDEN' }
      });
    }

    await historyItem.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Search history record deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};
