const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');
const { authenticateUser, authorizeAdmin } = require('../middleware/authMiddleware');

router.get('/', getCategories);
router.get('/:id', getCategoryById);
router.post('/', authenticateUser, authorizeAdmin, createCategory);
router.put('/:id', authenticateUser, authorizeAdmin, updateCategory);
router.delete('/:id', authenticateUser, authorizeAdmin, deleteCategory);

module.exports = router;
