const { Client } = require('@elastic/elasticsearch');

const esUrl = process.env.ELASTICSEARCH_URL || 'http://localhost:9200';
let esClient = null;

try {
  esClient = new Client({ node: esUrl });
  console.log(`[Elasticsearch Service]: Client configured for ${esUrl}`);
} catch (err) {
  console.error('[Elasticsearch Service]: Client init error:', err.message);
}

const INDEX_NAME = 'courses_index';

/**
 * Check health status of Elasticsearch service
 */
const checkHealth = async () => {
  if (!esClient) return { isConnected: false, message: 'Elasticsearch client not instantiated' };
  try {
    const health = await esClient.cluster.health();
    return {
      isConnected: true,
      clusterName: health.cluster_name,
      status: health.status,
      nodeUrl: esUrl
    };
  } catch (error) {
    return {
      isConnected: false,
      message: error.message || 'Elasticsearch node unreachable at localhost:9200'
    };
  }
};

/**
 * Synchronize MongoDB courses into Elasticsearch index
 * @param {Array<Object>} courses List of Mongoose course documents
 */
const syncCourses = async (courses) => {
  const health = await checkHealth();
  if (!health.isConnected) {
    throw new Error(`Elasticsearch server unreachable (${health.message})`);
  }

  // Create index if it doesn't exist
  const indexExists = await esClient.indices.exists({ index: INDEX_NAME });
  if (!indexExists) {
    await esClient.indices.create({
      index: INDEX_NAME,
      body: {
        mappings: {
          properties: {
            id: { type: 'keyword' },
            title: { type: 'text', analyzer: 'standard' },
            description: { type: 'text', analyzer: 'standard' },
            instructor: { type: 'text' },
            categoryName: { type: 'text' },
            level: { type: 'keyword' },
            price: { type: 'double' },
            rating: { type: 'double' },
            students: { type: 'integer' }
          }
        }
      }
    });
  }

  // Bulk index courses
  const body = courses.flatMap(course => [
    { index: { _index: INDEX_NAME, _id: course._id.toString() } },
    {
      id: course._id.toString(),
      title: course.title,
      description: course.description,
      instructor: course.instructor,
      categoryName: course.category?.name || '',
      level: course.level,
      price: course.price,
      rating: course.rating,
      students: course.students
    }
  ]);

  const bulkResponse = await esClient.bulk({ refresh: true, body });
  return {
    syncedCount: courses.length,
    errors: bulkResponse.errors
  };
};

/**
 * Search courses using Elasticsearch Multi-Match query with Field Boosting
 * @param {string} query Search term
 * @param {Object} filters Additional category, level, price filters
 */
const searchCourses = async (query, filters = {}) => {
  const health = await checkHealth();
  if (!health.isConnected) {
    return {
      isElasticActive: false,
      message: 'Elasticsearch offline - falling back to Rule-Based JS engine',
      results: []
    };
  }

  const mustClauses = [];

  if (query && query.trim()) {
    mustClauses.push({
      multi_match: {
        query: query.trim(),
        fields: ['title^3', 'categoryName^2', 'description^1'],
        fuzziness: 'AUTO'
      }
    });
  } else {
    mustClauses.push({ match_all: {} });
  }

  const filterClauses = [];
  if (filters.level) {
    filterClauses.push({ term: { level: filters.level } });
  }

  const searchBody = {
    query: {
      bool: {
        must: mustClauses,
        filter: filterClauses
      }
    }
  };

  const response = await esClient.search({
    index: INDEX_NAME,
    body: searchBody
  });

  const hits = response.hits.hits.map(hit => ({
    id: hit._id,
    score: hit._score,
    source: hit._source
  }));

  return {
    isElasticActive: true,
    totalHits: response.hits.total.value,
    hits
  };
};

module.exports = {
  checkHealth,
  syncCourses,
  searchCourses
};
