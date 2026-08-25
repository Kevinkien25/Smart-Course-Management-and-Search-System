const aiService = require('../services/aiService');

// @desc    Interactive Chat with Google Gemini AI Bot
// @route   POST /api/ai/chat
// @access  Public
exports.chatWithAI = async (req, res, next) => {
  try {
    const { history, message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a chat message',
        error: { code: 'MISSING_MESSAGE' }
      });
    }

    const reply = await aiService.chatWithAI(history || [], message.trim());

    res.status(200).json({
      success: true,
      message: 'AI reply generated successfully',
      data: {
        reply
      }
    });
  } catch (error) {
    next(error);
  }
};
