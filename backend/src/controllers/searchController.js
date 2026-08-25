const Course = require('../models/Course');
const SearchHistory = require('../models/SearchHistory');
const searchRankingService = require('../services/searchRankingService');

// @desc    Smart Search courses using Rule-Based Ranking Algorithm
// @route   GET /api/search?q=...
// @access  Public (Optionally authenticated to save search history)
exports.searchCourses = async (req, res, next) => {
  try {
    const { q, category, level, minPrice, maxPrice, sort } = req.query;

    const queryStr = q ? q.trim() : '';

    // Fetch all courses with populated category
    let courses = await Course.find().populate('category', 'name description');

    // Run Rule-Based Search Ranking Algorithm
    let rankedResults = searchRankingService.rankCourses(courses, queryStr);

    // Apply additional Filters if requested
    if (category) {
      rankedResults = rankedResults.filter(item => 
        item.course.category && item.course.category._id.toString() === category
      );
    }

    if (level) {
      rankedResults = rankedResults.filter(item => 
        item.course.level === level
      );
    }

    if (minPrice) {
      rankedResults = rankedResults.filter(item => 
        item.course.price >= Number(minPrice)
      );
    }

    if (maxPrice) {
      rankedResults = rankedResults.filter(item => 
        item.course.price <= Number(maxPrice)
      );
    }

    // Custom sort override if user explicitly requested a specific sort order
    if (sort === 'rating') {
      rankedResults.sort((a, b) => b.course.rating - a.course.rating);
    } else if (sort === 'students') {
      rankedResults.sort((a, b) => b.course.students - a.course.students);
    } else if (sort === 'price-asc') {
      rankedResults.sort((a, b) => a.course.price - b.course.price);
    } else if (sort === 'price-desc') {
      rankedResults.sort((a, b) => b.course.price - a.course.price);
    }
    // Default remains score DESC -> rating DESC -> students DESC

    // If user is authenticated, save search history record
    if (req.user && queryStr) {
      try {
        await SearchHistory.create({
          userId: req.user._id,
          keyword: queryStr,
          resultCount: rankedResults.length
        });
      } catch (err) {
        console.error('[SearchHistory Error]: Failed to save history:', err.message);
      }
    }

    res.status(200).json({
      success: true,
      message: `Found ${rankedResults.length} course(s) matching search criteria`,
      data: {
        query: queryStr,
        totalResults: rankedResults.length,
        results: rankedResults
      }
    });
  } catch (error) {
    next(error);
  }
};
