import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Container, Row, Col, Form, Card, Button, Badge, Spinner, InputGroup } from 'react-bootstrap';
import { Search, Filter, Sparkles, Bot, Lightbulb, Compass } from 'lucide-react';
import API from '../services/api';
import CourseCard from '../components/CourseCard';

const CourseList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || '';
  const initialLevel = searchParams.get('level') || '';
  const initialSort = searchParams.get('sort') || 'relevance';

  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedLevel, setSelectedLevel] = useState(initialLevel);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedSort, setSelectedSort] = useState(initialSort);

  const [categories, setCategories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(true);

  // AI Search Intent State
  const [aiIntent, setAiIntent] = useState(null);
  const [loadingAi, setLoadingAi] = useState(false);

  // Load categories list on mount
  useEffect(() => {
    API.get('/categories')
      .then(res => {
        if (res.data.success) setCategories(res.data.data);
      })
      .catch(err => console.error('[CourseList]: Failed to load categories:', err));
  }, []);

  // Fetch search results & AI intent whenever query params change
  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      const qParam = searchParams.get('q') || '';
      const catParam = searchParams.get('category') || '';
      const levelParam = searchParams.get('level') || '';
      const minPParam = searchParams.get('minPrice') || '';
      const maxPParam = searchParams.get('maxPrice') || '';
      const sortParam = searchParams.get('sort') || '';

      try {
        let endpoint = `/search?q=${encodeURIComponent(qParam)}`;
        if (catParam) endpoint += `&category=${catParam}`;
        if (levelParam) endpoint += `&level=${levelParam}`;
        if (minPParam) endpoint += `&minPrice=${minPParam}`;
        if (maxPParam) endpoint += `&maxPrice=${maxPParam}`;
        if (sortParam && sortParam !== 'relevance') endpoint += `&sort=${sortParam}`;

        const res = await API.get(endpoint);

        if (res.data.success) {
          setSearchResults(res.data.data.results || []);
          setTotalResults(res.data.data.totalResults || 0);
        }
      } catch (error) {
        console.error('[CourseList]: Search error:', error);
      } finally {
        setLoading(false);
      }

      // Trigger AI Search Intent Analysis if query exists
      if (qParam.trim()) {
        setLoadingAi(true);
        try {
          const aiRes = await API.get(`/ai/search-intent?q=${encodeURIComponent(qParam.trim())}`);
          if (aiRes.data.success) {
            setAiIntent(aiRes.data.data);
          }
        } catch (err) {
          console.error('[CourseList]: AI Intent error:', err);
        } finally {
          setLoadingAi(false);
        }
      } else {
        setAiIntent(null);
      }
    };

    fetchSearchResults();
  }, [searchParams]);

  const handleApplyFilter = (e) => {
    if (e) e.preventDefault();

    const params = {};
    if (query.trim()) params.q = query.trim();
    if (selectedCategory) params.category = selectedCategory;
    if (selectedLevel) params.level = selectedLevel;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    if (selectedSort) params.sort = selectedSort;

    setSearchParams(params);
  };

  const handleResetFilter = () => {
    setQuery('');
    setSelectedCategory('');
    setSelectedLevel('');
    setMinPrice('');
    setMaxPrice('');
    setSelectedSort('relevance');
    setAiIntent(null);
    setSearchParams({});
  };

  const handleKeywordTagClick = (keyword) => {
    setQuery(keyword);
    const params = Object.fromEntries(searchParams);
    params.q = keyword;
    setSearchParams(params);
  };

  return (
    <Container className="py-4">
      {/* Header Search Box */}
      <div className="bg-white p-4 rounded-4 shadow-sm mb-4 border">
        <Form onSubmit={handleApplyFilter}>
          <Row className="g-3 align-items-center">
            <Col lg={7}>
              <InputGroup size="lg">
                <InputGroup.Text className="bg-light border-end-0">
                  <Search size={20} className="text-muted" />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Nhập từ khóa tìm kiếm (VD: nodejs backend, reactjs)..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="bg-light border-start-0 shadow-none fs-6"
                />
              </InputGroup>
            </Col>

            <Col md={6} lg={3}>
              <Form.Select
                size="lg"
                value={selectedSort}
                onChange={(e) => {
                  setSelectedSort(e.target.value);
                  const newParams = Object.fromEntries(searchParams);
                  newParams.sort = e.target.value;
                  setSearchParams(newParams);
                }}
                className="bg-light shadow-none fs-6"
              >
                <option value="relevance">Sắp xếp: Độ phù hợp (Relevance)</option>
                <option value="rating">Đánh giá cao nhất</option>
                <option value="students">Học viên đông nhất</option>
                <option value="price-asc">Giá: Thấp đến Cao</option>
                <option value="price-desc">Giá: Cao đến Thấp</option>
              </Form.Select>
            </Col>

            <Col md={6} lg={2}>
              <Button type="submit" variant="primary" size="lg" className="w-100 fw-bold">
                Tìm kiếm
              </Button>
            </Col>
          </Row>
        </Form>
      </div>

      {/* AI Intent & Keyword Expansion Card */}
      {searchParams.get('q') && (
        <Card className="border-0 shadow-sm rounded-4 mb-4 text-white" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)' }}>
          <Card.Body className="p-4">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <div className="d-flex align-items-center gap-2 text-warning fw-bold fs-6">
                <Bot size={22} />
                <span>OpenAI Search Intent Analysis & Keyword Expansion</span>
                <Badge bg="success" className="ms-1">OpenAI API Active ⚡</Badge>
              </div>
              {loadingAi && <Spinner animation="border" size="sm" variant="warning" />}
            </div>

            {aiIntent ? (
              <Row className="g-3 align-items-center">
                <Col lg={7}>
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <span className="text-light opacity-75 small">Ý định tìm kiếm (Intent):</span>
                    <Badge bg="info" className="fs-6 px-3 py-1">{aiIntent.intent}</Badge>
                    <Badge bg="primary" className="fs-6 px-3 py-1">{aiIntent.targetTechnology}</Badge>
                  </div>
                  <p className="text-light extra-small mb-0 opacity-90 d-flex align-items-center gap-1">
                    <Lightbulb size={14} className="text-warning flex-shrink-0" />
                    <strong>Lời khuyên OpenAI:</strong> {aiIntent.aiAdvice}
                  </p>
                </Col>

                <Col lg={5}>
                  <div className="small text-light opacity-75 mb-2 d-flex align-items-center gap-1">
                    <Compass size={14} /> OpenAI Mở rộng từ khóa (Click để lọc nhanh):
                  </div>
                  <div className="d-flex flex-wrap gap-2">
                    {aiIntent.expandedKeywords.map((kw, idx) => (
                      <Button
                        key={idx}
                        variant="outline-light"
                        size="sm"
                        className="py-1 px-3 extra-small rounded-pill border-opacity-50"
                        onClick={() => handleKeywordTagClick(kw)}
                      >
                        + {kw}
                      </Button>
                    ))}
                  </div>
                </Col>
              </Row>
            ) : (
              <p className="text-light small mb-0 opacity-75">Đang phân tích từ khóa với OpenAI GPT Engine...</p>
            )}
          </Card.Body>
        </Card>
      )}

      <Row>
        {/* Left Filter Sidebar */}
        <Col lg={3} className="mb-4">
          <Card className="border-0 shadow-sm rounded-4 p-3">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                  <Filter size={18} className="text-primary" /> Bộ Lọc
                </h5>
                <Button variant="link" size="sm" onClick={handleResetFilter} className="text-muted p-0 text-decoration-none extra-small">
                  Đặt lại
                </Button>
              </div>

              <Form onSubmit={handleApplyFilter}>
                {/* Category Filter */}
                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold small text-secondary">Danh Mục Khóa Học</Form.Label>
                  <Form.Select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="shadow-none border-secondary-subtle"
                  >
                    <option value="">Tất cả danh mục</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                {/* Level Filter */}
                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold small text-secondary">Trình Độ</Form.Label>
                  <Form.Select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="shadow-none border-secondary-subtle"
                  >
                    <option value="">Tất cả trình độ</option>
                    <option value="Beginner">Beginner (Cơ bản)</option>
                    <option value="Intermediate">Intermediate (Trung cấp)</option>
                    <option value="Advanced">Advanced (Nâng cao)</option>
                  </Form.Select>
                </Form.Group>

                {/* Price Range Filter */}
                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold small text-secondary">Khoảng Giá (VNĐ)</Form.Label>
                  <Row className="g-2">
                    <Col xs={6}>
                      <Form.Control
                        type="number"
                        placeholder="Từ"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="shadow-none"
                      />
                    </Col>
                    <Col xs={6}>
                      <Form.Control
                        type="number"
                        placeholder="Đến"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="shadow-none"
                      />
                    </Col>
                  </Row>
                </Form.Group>

                <Button type="submit" variant="outline-primary" className="w-100 fw-semibold">
                  Áp dụng bộ lọc
                </Button>
              </Form>

              <hr className="my-4" />

              <div className="bg-light p-3 rounded-3 border">
                <div className="d-flex align-items-center gap-1 text-primary fw-bold small mb-2">
                  <Sparkles size={14} /> Hybrid Rule & OpenAI Engine
                </div>
                <p className="extra-small text-muted mb-0">
                  Hệ thống kết hợp thuật toán tính điểm độ phù hợp Rule-Based (Title +8, Title Term +5, Desc +2, Category +3) cùng với OpenAI Intent Analysis.
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Right Search Results Grid */}
        <Col lg={9}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-0">
              Kết Quả Tìm Kiếm{' '}
              <Badge bg="secondary" className="ms-2">
                {totalResults} khóa học
              </Badge>
            </h5>

            {searchParams.get('q') && (
              <span className="small text-muted">
                Từ khóa: <strong className="text-primary">"{searchParams.get('q')}"</strong>
              </span>
            )}
          </div>

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="text-muted mt-2 small">Đang phân tích và tính toán xếp hạng khóa học...</p>
            </div>
          ) : searchResults.length === 0 ? (
            <Card className="border-0 shadow-sm text-center py-5 rounded-4">
              <Card.Body>
                <Bot size={48} className="text-muted mb-3" />
                <h5 className="fw-bold">Không tìm thấy khóa học phù hợp</h5>
                <p className="text-muted small">Thử thay đổi từ khóa hoặc sử dụng gợi ý từ OpenAI.</p>
                <Button variant="primary" onClick={handleResetFilter}>
                  Đặt lại tìm kiếm
                </Button>
              </Card.Body>
            </Card>
          ) : (
            <Row className="g-4">
              {searchResults.map((item) => (
                <Col key={item.course._id} md={6}>
                  <CourseCard
                    course={item.course}
                    score={item.score}
                    matchedFields={item.matchedFields}
                  />
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default CourseList;
