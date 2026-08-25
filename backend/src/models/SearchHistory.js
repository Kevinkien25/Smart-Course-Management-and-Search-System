const mongoose = require('mongoose');

const searchHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    keyword: {
      type: String,
      required: true,
      trim: true
    },
    resultCount: {
      type: Number,
      default: 0
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }
);

module.exports = mongoose.model('SearchHistory', searchHistorySchema, 'search_histories');
