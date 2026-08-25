const OpenAI = require('openai');

let openaiClient = null;

const apiKey = process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.trim() : '';

if (apiKey) {
  try {
    openaiClient = new OpenAI({ apiKey });
    console.log('[AI Service]: OpenAI API Client initialized successfully with active API Key!');
  } catch (err) {
    console.error('[AI Service]: OpenAI Initialization warning:', err.message);
  }
}

/**
 * Analyze user search query intent & suggest related keywords using OpenAI
 * @param {string} query - Raw search term entered by user
 */
const analyzeSearchIntent = async (query) => {
  if (!query || !query.trim()) {
    return {
      intent: 'General Browse',
      targetTechnology: 'Web Development',
      expandedKeywords: [],
      aiAdvice: 'Nhập từ khóa kỹ thuật cụ thể để nhận gợi ý lộ trình phù hợp từ OpenAI.'
    };
  }

  if (openaiClient) {
    try {
      const response = await openaiClient.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an AI IT Career Advisor & Search Intent Analyzer for an online course platform. Respond strictly in JSON format.'
          },
          {
            role: 'user',
            content: `Analyze search query: "${query}". Return JSON with keys: "intent" (e.g. Backend Development, Frontend UI, Database), "targetTechnology", "expandedKeywords" (array of 3-5 related tech terms), "aiAdvice" (1 short advice in Vietnamese).`
          }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3,
        max_tokens: 300
      });

      const result = JSON.parse(response.choices[0].message.content);
      return {
        isLiveAI: true,
        intent: result.intent || 'IT Skill Learning',
        targetTechnology: result.targetTechnology || query,
        expandedKeywords: result.expandedKeywords || [query],
        aiAdvice: result.aiAdvice || 'Lựa chọn các khóa học có dự án thực tế để tăng trải nghiệm.'
      };
    } catch (error) {
      console.error('[AI Service]: OpenAI API call error:', error.message);
    }
  }

  // Fallback simulator if key is invalid or fails
  return {
    isLiveAI: false,
    intent: 'Lập trình Web',
    targetTechnology: 'JavaScript Stack',
    expandedKeywords: [query, 'Node.js', 'ReactJS', 'ExpressJS', 'MongoDB'],
    aiAdvice: 'Học theo thứ tự từ cơ bản đến nâng cao và hoàn thành dự án thực hành.'
  };
};

/**
 * Summarize course content using OpenAI
 * @param {string} title - Course title
 * @param {string} description - Full course description
 */
const summarizeCourse = async (title, description) => {
  if (openaiClient) {
    try {
      const response = await openaiClient.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an AI Tech Course Summarizer. Summarize in Vietnamese.'
          },
          {
            role: 'user',
            content: `Khóa học: "${title}". Mô tả: "${description}". Hãy tóm tắt 3 điểm nổi bật nhất (bullet points) và 1 nhóm đối tượng phù hợp. Trả về dạng JSON có keys: "highlights" (array of 3 strings), "targetAudience" (string).`
          }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3,
        max_tokens: 350
      });

      const result = JSON.parse(response.choices[0].message.content);
      return {
        isLiveAI: true,
        highlights: result.highlights || [],
        targetAudience: result.targetAudience || 'Dành cho các bạn muốn phát triển sự nghiệp lập trình web.'
      };
    } catch (error) {
      console.error('[AI Service]: OpenAI summarize error:', error.message);
    }
  }

  // Fallback Summary
  return {
    isLiveAI: false,
    highlights: [
      `Nắm vững kiến thức chuyên sâu về ${title}`,
      'Thực hành dự án thực tế với sự hướng dẫn của giảng viên chuyên nghiệp',
      'Xây dựng tư duy thiết kế hệ thống và viết code chuẩn sạch'
    ],
    targetAudience: 'Phù hợp cho học viên muốn nâng cao kỹ năng lập trình web.'
  };
};

module.exports = {
  analyzeSearchIntent,
  summarizeCourse
};
