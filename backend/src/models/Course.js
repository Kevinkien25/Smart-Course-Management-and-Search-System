const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a course title'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please provide a course description'],
      trim: true
    },
    instructor: {
      type: String,
      required: [true, 'Please provide an instructor name'],
      trim: true
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Please specify a course category']
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner'
    },
    price: {
      type: Number,
      required: [true, 'Please provide course price'],
      min: [0, 'Price cannot be negative'],
      default: 0
    },
    rating: {
      type: Number,
      min: [0, 'Rating cannot be below 0'],
      max: [5, 'Rating cannot exceed 5'],
      default: 0
    },
    students: {
      type: Number,
      min: [0, 'Students count cannot be negative'],
      default: 0
    },
    thumbnail: {
      type: String,
      default: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=60'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Course', courseSchema);
