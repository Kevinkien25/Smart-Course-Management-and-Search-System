const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

// @desc    Enroll authenticated user in a course
// @route   POST /api/enrollments
// @access  Private (User)
exports.enrollCourse = async (req, res, next) => {
  try {
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide courseId',
        error: { code: 'MISSING_COURSE_ID' }
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
        error: { code: 'NOT_FOUND' }
      });
    }

    // Check existing enrollment
    const existingEnrollment = await Enrollment.findOne({
      userId: req.user._id,
      courseId
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'You are already enrolled in this course',
        error: { code: 'ALREADY_ENROLLED' }
      });
    }

    const enrollment = await Enrollment.create({
      userId: req.user._id,
      courseId
    });

    // Increment students count in course document
    course.students = (course.students || 0) + 1;
    await course.save();

    const populatedEnrollment = await Enrollment.findById(enrollment._id)
      .populate({
        path: 'courseId',
        populate: { path: 'category', select: 'name' }
      });

    res.status(201).json({
      success: true,
      message: 'Enrolled in course successfully',
      data: populatedEnrollment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get enrollments for current user or all enrollments if admin
// @route   GET /api/enrollments
// @access  Private
exports.getUserEnrollments = async (req, res, next) => {
  try {
    const queryFilter = req.user.role === 'admin' ? {} : { userId: req.user._id };

    const enrollments = await Enrollment.find(queryFilter)
      .populate({
        path: 'courseId',
        populate: { path: 'category', select: 'name' }
      })
      .populate('userId', 'name email')
      .sort({ enrolledAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Enrollments retrieved successfully',
      data: enrollments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single enrollment details
// @route   GET /api/enrollments/:id
// @access  Private
exports.getEnrollmentById = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id)
      .populate({
        path: 'courseId',
        populate: { path: 'category', select: 'name' }
      })
      .populate('userId', 'name email');

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment record not found',
        error: { code: 'NOT_FOUND' }
      });
    }

    // Ensure user owns enrollment or is admin
    if (enrollment.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this enrollment record',
        error: { code: 'FORBIDDEN' }
      });
    }

    res.status(200).json({
      success: true,
      message: 'Enrollment record retrieved',
      data: enrollment
    });
  } catch (error) {
    next(error);
  }
};
