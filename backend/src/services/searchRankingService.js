/**
 * Rule-Based Search Ranking Algorithm Service
 * 
 * NOTE: 100% Pure JavaScript logic.
 * NO Machine Learning, NO Python, NO AI models, NO Elasticsearch, NO Redis used.
 */

/**
 * Normalizes input string by converting to lowercase, removing accent marks (optional/standardized),
 * trimming redundant whitespace, and tokenizing into words.
 * 
 * @param {string} text - Input query string
 * @returns {Array<string>} Tokens list
 */
const tokenize = (text) => {
  if (!text || typeof text !== 'string') return [];
  
  return text
    .toLowerCase()
    // Normalize unicode characters (removes accents for Vietnamese matching if needed while maintaining original)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/gi, ' ') // Replace punctuation with space
    .trim()
    .split(/\s+/)
    .filter(token => token.length > 0);
};

/**
 * Rank candidate courses based on a rule-based scoring formula:
 * 
 * Formula Scoring Rules:
 * - Exact Match in Title: +8 points (Whole query matches title normalized)
 * - Title Keyword Match:  +5 points per matching token
 * - Description Match:    +2 points per matching token
 * - Category Match:       +3 points if token matches category name
 * - Rating Bonus:         rating * 0.5 (max 2.5 points)
 * - Popularity Bonus:     log10(students + 1) (logarithmic capped bonus)
 * 
 * Tie-Breaker Priority:
 * 1. score DESC
 * 2. rating DESC
 * 3. students DESC
 * 
 * @param {Array<Object>} courses - Array of course Mongoose documents (with populated category)
 * @param {string} query - Raw search term entered by user
 * @returns {Array<Object>} List of ranked courses with score and matchedFields
 */
const rankCourses = (courses, query) => {
  if (!query || !query.trim()) {
    // If no search query provided, return courses sorted by rating & students with 0 relevance score
    return courses.map(course => ({
      course,
      score: 0,
      matchedFields: []
    }));
  }

  const normalizedQuery = query.toLowerCase().trim();
  const tokens = tokenize(query);

  const scoredResults = courses.map(course => {
    let score = 0;
    const matchedFieldsSet = new Set();

    const normalizedTitle = (course.title || '').toLowerCase();
    const titleTokens = tokenize(course.title);
    
    const normalizedDesc = (course.description || '').toLowerCase();
    const descTokens = tokenize(course.description);
    
    const categoryName = course.category && course.category.name ? course.category.name : '';
    const categoryTokens = tokenize(categoryName);

    // Rule 1: Title Exact Match Bonus (+8 points)
    // Checks if the full query string is contained exactly inside the title
    if (normalizedTitle.includes(normalizedQuery)) {
      score += 8;
      matchedFieldsSet.add('title');
    }

    // Rule 2: Title Keyword Matches (+5 points per token)
    let titleMatchCount = 0;
    tokens.forEach(token => {
      if (titleTokens.includes(token) || normalizedTitle.includes(token)) {
        titleMatchCount++;
      }
    });
    if (titleMatchCount > 0) {
      score += titleMatchCount * 5;
      matchedFieldsSet.add('title');
    }

    // Rule 3: Description Keyword Matches (+2 points per token)
    let descMatchCount = 0;
    tokens.forEach(token => {
      if (descTokens.includes(token) || normalizedDesc.includes(token)) {
        descMatchCount++;
      }
    });
    if (descMatchCount > 0) {
      score += descMatchCount * 2;
      matchedFieldsSet.add('description');
    }

    // Rule 4: Category Keyword Matches (+3 points if match)
    let categoryMatchCount = 0;
    tokens.forEach(token => {
      if (categoryTokens.includes(token) || categoryName.toLowerCase().includes(token)) {
        categoryMatchCount++;
      }
    });
    if (categoryMatchCount > 0) {
      score += 3;
      matchedFieldsSet.add('category');
    }

    // Include candidate course ONLY if it matched at least one query term or category
    const isMatched = matchedFieldsSet.size > 0;

    if (isMatched) {
      // Rule 5: Rating Boost (rating * 0.5)
      const ratingBonus = (course.rating || 0) * 0.5;
      score += ratingBonus;

      // Rule 6: Students Count Popularity Boost (log10(students + 1))
      const studentBonus = Math.log10((course.students || 0) + 1);
      score += studentBonus;
    }

    return {
      course,
      score: Number(score.toFixed(2)),
      matchedFields: Array.from(matchedFieldsSet),
      isMatched
    };
  });

  // Filter out courses with 0 matches when a search query is actively provided
  const candidateResults = scoredResults.filter(item => item.isMatched);

  // Sorting logic (Rule-Based Order):
  // 1. score DESC
  // 2. rating DESC
  // 3. students DESC
  candidateResults.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    if (b.course.rating !== a.course.rating) {
      return b.course.rating - a.course.rating;
    }
    return (b.course.students || 0) - (a.course.students || 0);
  });

  // Remove temporary boolean flag before returning API response
  return candidateResults.map(({ course, score, matchedFields }) => ({
    course,
    score,
    matchedFields
  }));
};

module.exports = {
  tokenize,
  rankCourses
};
