const Category = require('../models/Category');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.status(200).json({
      success: true,
      message: 'Categories retrieved successfully',
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single category by ID
// @route   GET /api/categories/:id
// @access  Public
exports.getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
        error: { code: 'NOT_FOUND' }
      });
    }
    res.status(200).json({
      success: true,
      message: 'Category retrieved successfully',
      data: category
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new category
// @route   POST /api/categories
// @access  Private/Admin
exports.createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required',
        error: { code: 'MISSING_FIELD' }
      });
    }

    const categoryExists = await Category.findOne({ name: name.trim() });
    if (categoryExists) {
      return res.status(400).json({
        success: false,
        message: `Category '${name}' already exists`,
        error: { code: 'DUPLICATE_CATEGORY' }
      });
    }

    const category = await Category.create({
      name: name.trim(),
      description: description ? description.trim() : ''
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
exports.updateCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    let category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
        error: { code: 'NOT_FOUND' }
      });
    }

    if (name) category.name = name.trim();
    if (description !== undefined) category.description = description.trim();

    category = await category.save();

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: category
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
        error: { code: 'NOT_FOUND' }
      });
    }

    await category.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};
