const https = require('https');
const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');
const Course = require('../models/Course');

dotenv.config({ path: path.join(__dirname, '../../.env') });

/**
 * Call Google Gemini REST API directly using gemini-flash-latest / gemini-3.5-flash-lite
 * @param {string} promptText The prompt to send to Gemini
 */
const callGeminiRestApi = (promptText) => {
  return new Promise((resolve, reject) => {
    const apiKey = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : '';
    if (!apiKey) {
      return reject(new Error('GEMINI_API_KEY is missing in backend/.env'));
    }

    const requestBody = JSON.stringify({
      contents: [
        {
          parts: [
            { text: promptText }
          ]
        }
      ]
    });

    // Try model endpoints matching the working curl: gemini-flash-latest, gemini-3.5-flash-lite, gemini-1.5-flash
    const model = 'gemini-flash-latest';
    const options = {
      hostname: 'generativelanguage.googleapis.com',
      port: 443,
      path: `/v1beta/models/${model}:generateContent`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': apiKey,
        'Content-Length': Buffer.byteLength(requestBody)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const parsed = JSON.parse(data);
            const textResponse = parsed.candidates?.[0]?.content?.parts?.[0]?.text || '';
            resolve(textResponse);
          } catch (e) {
            reject(new Error('Failed to parse Gemini API response JSON'));
          }
        } else {
          reject(new Error(`Gemini API HTTP Error ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.write(requestBody);
    req.end();
  });
};

/**
 * Chat with Google Gemini AI Bot (Floating Chat Bubble Service)
 * @param {Array<Object>} history Chat message history [{ role: 'user'|'model', content: '...' }]
 * @param {string} userMessage Latest message typed by user
 */
const chatWithAI = async (history = [], userMessage = '') => {
  if (!userMessage || !userMessage.trim()) {
    return 'Xin chào! Tôi có thể giúp gì cho bạn về các khóa học lập trình?';
  }

  // Fetch available courses context safely if Mongoose is connected
  let coursesContext = '';
  if (mongoose.connection.readyState === 1) {
    try {
      const courses = await Course.find()
        .populate('category', 'name')
        .select('title description level price rating instructor students category')
        .limit(10);
      coursesContext = courses
        .map(
          c =>
            `- ${c.title} (Danh mục: ${c.category?.name || 'N/A'}, Cấp độ: ${c.level}, Giá: ${
              c.price === 0 ? 'Miễn phí' : c.price.toLocaleString('vi-VN') + 'đ'
            }, Đánh giá: ${c.rating}⭐)`
        )
        .join('\n');
    } catch (e) {
      console.error('[AI Service]: Context load error:', e.message);
    }
  }

  try {
    console.log(`[AI Chat]: Calling Gemini REST API (gemini-flash-latest) for prompt "${userMessage.substring(0, 30)}..."`);

    const systemPrompt = `Bạn là Trợ lý AI Thông Minh (EduSmart Bot) chuyên tư vấn khóa học lập trình và định hướng sự nghiệp IT.
Trả lời ngắn gọn, thân thiện, lịch sự bằng tiếng Việt (có biểu tượng emoji thích hợp).

Dưới đây là danh sách khóa học hiện có trong hệ thống của chúng tôi để bạn tham khảo tư vấn cho học viên:
${coursesContext}

Hãy trả lời thắc mắc của học viên một cách chính xác dựa trên danh sách khóa học trên và kiến thức CNTT chuẩn.`;

    const prompt = `${systemPrompt}\n\nLịch sử hội thoại trước đó:\n${history
      .map(m => `${m.role === 'user' ? 'Học viên' : 'Trợ lý AI'}: ${m.content}`)
      .join('\n')}\n\nHọc viên: ${userMessage}\nTrợ lý AI:`;

    const reply = await callGeminiRestApi(prompt);
    console.log('[AI Chat]: Live Gemini API response received successfully!');
    return reply;
  } catch (error) {
    console.error('[AI Service]: Gemini REST API error:', error.message);
  }

  // Smart Fallback Response Generator if Gemini Key is missing or failing
  const msg = userMessage.toLowerCase();
  if (msg.includes('node') || msg.includes('backend') || msg.includes('express')) {
    return '🚀 Để học Node.js Backend, tôi khuyên bạn nên chọn khóa học "NodeJS Backend từ cơ bản đến nâng cao" hoặc "Fullstack JavaScript MERN Stack". Khóa học sẽ hướng dẫn bạn dựng RESTful API với Express và MongoDB chuẩn doanh nghiệp!';
  } else if (msg.includes('react') || msg.includes('front')) {
    return '⚡ Với Frontend ReactJS, bạn có thể tham khảo khóa "ReactJS cơ bản và ứng dụng thực tế". Khóa học bao gồm React Hooks, State Management và Router DOM giúp bạn tự tay làm web SPA hiện đại.';
  } else if (msg.includes('miễn phí') || msg.includes('free') || msg.includes('giá')) {
    return '💰 Hệ thống hiện có nhiều khóa học với mức giá ưu đãi từ 290.000đ đến các khóa Miễn phí. Bạn có thể sử dụng bộ lọc khoảng giá tại trang "Tìm kiếm khóa học" để xem danh sách cụ thể nhé!';
  } else if (msg.includes('xin chào') || msg.includes('chào') || msg.includes('hi')) {
    return '👋 Xin chào bạn! Tôi là Trợ lý AI EduSmart. Bạn đang muốn tìm khóa học về công nghệ gì (Node.js, ReactJS, MongoDB, Fullstack...)?';
  }

  return '💡 Tôi là EduSmart AI Bot. Bạn có thể hỏi tôi về các khóa học Node.js, ReactJS, MongoDB, Fullstack hoặc lời khuyên định hướng lập trình IT nhé!';
};

module.exports = {
  chatWithAI,
  callGeminiRestApi
};
