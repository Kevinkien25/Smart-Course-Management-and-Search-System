import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Badge, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Sparkles, Code, Cpu, Database, Globe, Layers, ArrowRight } from 'lucide-react';
import API from '../services/api';
import CourseCard from '../components/CourseCard';

const Home = () => {
  const [query, setQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, courseRes] = await Promise.all([
          API.get('/categories'),
          API.get('/courses?sort=rating')
        ]);
        if (catRes.data.success) setCategories(catRes.data.data);
        if (courseRes.data.success) setFeaturedCourses(courseRes.data.data.slice(0, 6));
      } catch (error) {
        console.error('[Home]: Failed to load home data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/courses?q=${encodeURIComponent(query.trim())}`);
    } else {
      navigate('/courses');
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="hero-section">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={9}>
              <Badge bg="primary" className="mb-3 px-3 py-2 fs-6 rounded-pill border border-primary-subtle shadow-sm">
                <Sparkles size={14} className="me-1" /> 100% Pure JavaScript Rule-Based Ranking Engine
              </Badge>
              <h1 className="display-4 fw-extrabold mb-3 text-white lh-base">
                Tìm Kiếm & Quản Lý Khóa Học <span className="text-primary">Thông Minh</span>
              </h1>
              <p className="lead text-light mb-5 opacity-90 mx-auto" style={{ maxWidth: '700px' }}>
                Hệ thống xếp hạng tìm kiếm tự động tính điểm mức độ phù hợp (Relevance Score) dựa trên tiêu đề, mô tả, danh mục và lượt đánh giá mà không cần Machine Learning hay AI.
              </p>

              {/* Search Bar Form */}
              <Form onSubmit={handleSearchSubmit} className="search-box-hero d-flex align-items-center mb-4">
                <Search size={24} className="ms-3 text-muted" />
                <Form.Control
                  type="text"
                  placeholder="Nhập từ khóa (Ví dụ: nodejs backend, reactjs, fullstack)..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="shadow-none"
                />
                <Button type="submit" variant="primary" size="lg" className="px-4 py-3 fw-bold rounded-3 me-1">
                  Tìm kiếm
                </Button>
              </Form>

              <div className="d-flex flex-wrap justify-content-center gap-2 text-muted small">
                <span className="text-light opacity-75 me-2">Gợi ý từ khóa:</span>
                {['nodejs backend', 'reactjs', 'javascript', 'expressjs', 'mongodb'].map((term) => (
                  <Button
                    key={term}
                    variant="outline-light"
                    size="sm"
                    className="rounded-pill py-0 px-3 opacity-85"
                    onClick={() => navigate(`/courses?q=${encodeURIComponent(term)}`)}
                  >
                    {term}
                  </Button>
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Categories Section */}
      <Container className="py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="fw-bold text-dark mb-1">Danh Mục Nổi Bật</h3>
            <p className="text-muted small mb-0">Khám phá khóa học theo từng công nghệ chuyên môn</p>
          </div>
          <Button as={Link} to="/courses" variant="link" className="text-primary fw-semibold p-0 text-decoration-none d-flex align-items-center gap-1">
            Xem tất cả <ArrowRight size={16} />
          </Button>
        </div>

        <Row className="g-3">
          {categories.slice(0, 8).map((cat) => (
            <Col key={cat._id} xs={6} md={3}>
              <Card 
                className="h-100 border-0 shadow-sm text-center p-3 hover-lift cursor-pointer rounded-4"
                onClick={() => navigate(`/courses?category=${cat._id}`)}
                style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
              >
                <Card.Body className="d-flex flex-column align-items-center justify-content-center">
                  <div className="bg-primary-subtle text-primary p-3 rounded-circle mb-3">
                    <Code size={24} />
                  </div>
                  <Card.Title className="fw-bold fs-6 text-dark mb-1">{cat.name}</Card.Title>
                  <Card.Text className="text-muted extra-small text-truncate w-100">
                    {cat.description || 'Các khóa học chất lượng cao'}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Featured Courses Section */}
      <Container className="pb-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="fw-bold text-dark mb-1">Khóa Học Đánh Giá Cao</h3>
            <p className="text-muted small mb-0">Được sắp xếp theo điểm đánh giá và lượt học viên đông đảo</p>
          </div>
          <Button as={Link} to="/courses" variant="outline-primary" className="fw-semibold px-3">
            Tất cả khóa học
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <Row className="g-4">
            {featuredCourses.map((course) => (
              <Col key={course._id} md={6} lg={4}>
                <CourseCard course={course} />
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
};

export default Home;
