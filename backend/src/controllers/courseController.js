const Course = require('../models/Course');
const Category = require('../models/Category');

// @desc    Get all courses with filtering & sorting
// @route   GET /api/courses
// @access  Public
exports.getCourses = async (req, res, next) => {
  try {
    const { category, level, minPrice, maxPrice, minRating, sort } = req.query;

    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (level) {
      filter.level = level;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (minRating) {
      filter.rating = { $gte: Number(minRating) };
    }

    // Sort options
    let sortOptions = { createdAt: -1 }; // default newest
    if (sort === 'rating') sortOptions = { rating: -1 };
    if (sort === 'students') sortOptions = { students: -1 };
    if (sort === 'price-asc') sortOptions = { price: 1 };
    if (sort === 'price-desc') sortOptions = { price: -1 };

    const courses = await Course.find(filter)
      .populate('category', 'name description')
      .sort(sortOptions);

    res.status(200).json({
      success: true,
      message: 'Courses retrieved successfully',
      data: courses
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single course by ID
// @route   GET /api/courses/:id
// @access  Public
exports.getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id).populate('category', 'name description');
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
        error: { code: 'NOT_FOUND' }
      });
    }

    res.status(200).json({
      success: true,
      message: 'Course retrieved successfully',
      data: course
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new course
// @route   POST /api/courses
// @access  Private/Admin
exports.createCourse = async (req, res, next) => {
  try {
    const { title, description, instructor, category, level, price, rating, students, thumbnail } = req.body;

    // Validation
    if (!title || !description || !instructor || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, instructor, and category',
        error: { code: 'MISSING_FIELDS' }
      });
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category ID provided',
        error: { code: 'INVALID_CATEGORY' }
      });
    }

    const course = await Course.create({
      title: title.trim(),
      description: description.trim(),
      instructor: instructor.trim(),
      category,
      level: level || 'Beginner',
      price: price !== undefined ? Number(price) : 0,
      rating: rating !== undefined ? Number(rating) : 0,
      students: students !== undefined ? Number(students) : 0,
      thumbnail: thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=60'
    });

    const populatedCourse = await Course.findById(course._id).populate('category', 'name description');

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: populatedCourse
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private/Admin
exports.updateCourse = async (req, res, next) => {
  try {
    let course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
        error: { code: 'NOT_FOUND' }
      });
    }

    if (req.body.category) {
      const categoryExists = await Category.findById(req.body.category);
      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          message: 'Invalid category ID provided',
          error: { code: 'INVALID_CATEGORY' }
        });
      }
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('category', 'name description');

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      data: course
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
exports.deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
        error: { code: 'NOT_FOUND' }
      });
    }

    await course.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};
