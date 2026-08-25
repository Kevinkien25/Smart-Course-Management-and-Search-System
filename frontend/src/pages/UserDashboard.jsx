import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { BookOpen, History, User, Search, ArrowRight } from 'lucide-react';
import API from '../services/api';

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const [enrollmentsCount, setEnrollmentsCount] = useState(0);
  const [searchesCount, setSearchesCount] = useState(0);
  const [recentCourses, setRecentCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [enrollRes, historyRes] = await Promise.all([
          API.get('/enrollments'),
          API.get('/search-history')
        ]);

        if (enrollRes.data.success) {
          setEnrollmentsCount(enrollRes.data.data.length);
          setRecentCourses(enrollRes.data.data.slice(0, 3));
        }
        if (historyRes.data.success) {
          setSearchesCount(historyRes.data.data.length);
        }
      } catch (error) {
        console.error('[UserDashboard]: Failed to load user stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Container className="py-4">
      {/* Welcome Banner */}
      <div className="bg-white p-4 rounded-4 shadow-sm border mb-4">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
          <div>
            <h3 className="fw-bold text-dark mb-1">Xin chào, {user?.name}! 👋</h3>
            <p className="text-muted small mb-0">Chào mừng bạn quay lại hệ thống quản lý học tập thông minh EduSmart.</p>
          </div>
          <Button as={Link} to="/courses" variant="primary" className="fw-semibold d-flex align-items-center gap-2">
            <Search size={18} /> Khám phá khóa học
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <Row className="g-4 mb-4">
        <Col md={6} lg={4}>
          <Card className="border-0 shadow-sm rounded-4 p-3 bg-primary text-white">
            <Card.Body className="d-flex align-items-center justify-content-between">
              <div>
                <h6 className="text-white-50 text-uppercase extra-small fw-bold">Khóa học đã đăng ký</h6>
                <h2 className="fw-extrabold mb-0">{loading ? '...' : enrollmentsCount}</h2>
              </div>
              <BookOpen size={40} className="opacity-75" />
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={4}>
          <Card className="border-0 shadow-sm rounded-4 p-3 bg-secondary text-white">
            <Card.Body className="d-flex align-items-center justify-content-between">
              <div>
                <h6 className="text-white-50 text-uppercase extra-small fw-bold">Lượt tìm kiếm đã thực hiện</h6>
                <h2 className="fw-extrabold mb-0">{loading ? '...' : searchesCount}</h2>
              </div>
              <History size={40} className="opacity-75" />
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={4}>
          <Card className="border-0 shadow-sm rounded-4 p-3 bg-dark text-white">
            <Card.Body className="d-flex align-items-center justify-content-between">
              <div>
                <h6 className="text-white-50 text-uppercase extra-small fw-bold">Tài khoản cá nhân</h6>
                <h6 className="fw-bold mb-0 text-truncate">{user?.email}</h6>
              </div>
              <User size={40} className="opacity-75" />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Enrolled Courses */}
      <Card className="border-0 shadow-sm rounded-4">
        <Card.Body className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="fw-bold mb-0 text-dark">Khóa Học Đã Đăng Ký Gần Đây</h5>
            <Button as={Link} to="/my-courses" variant="link" className="text-primary p-0 text-decoration-none small fw-semibold">
              Xem tất cả ({enrollmentsCount}) <ArrowRight size={14} />
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : recentCourses.length === 0 ? (
            <div className="text-center py-4 text-muted">
              <p className="mb-2">Bạn chưa đăng ký khóa học nào.</p>
              <Button as={Link} to="/courses" variant="outline-primary" size="sm">
                Tìm khóa học ngay
              </Button>
            </div>
          ) : (
            <Row className="g-3">
              {recentCourses.map((enrollment) => (
                <Col md={4} key={enrollment._id}>
                  <Card className="h-100 border rounded-3 p-3">
                    <Card.Body className="p-0 d-flex flex-column">
                      <h6 className="fw-bold text-dark mb-2">{enrollment.courseId?.title}</h6>
                      <p className="text-muted extra-small mb-3 flex-grow-1 text-truncate">
                        {enrollment.courseId?.description}
                      </p>
                      <Button as={Link} to={`/courses/${enrollment.courseId?._id}`} variant="primary" size="sm" className="w-100 fw-semibold">
                        Vào học ngay
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default UserDashboard;
