import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BookOpen, Calendar, ArrowRight } from 'lucide-react';
import API from '../services/api';

const MyCourses = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/enrollments')
      .then((res) => {
        if (res.data.success) {
          setEnrollments(res.data.data);
        }
      })
      .catch((err) => console.error('[MyCourses]: Error loading enrollments:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-1">Khóa Học Của Tôi</h3>
          <p className="text-muted small mb-0">Danh sách các khóa học bạn đã đăng ký tham gia</p>
        </div>
        <Button as={Link} to="/courses" variant="outline-primary" className="fw-semibold">
          Tìm thêm khóa học
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : enrollments.length === 0 ? (
        <Card className="border-0 shadow-sm rounded-4 text-center py-5">
          <Card.Body>
            <BookOpen size={48} className="text-muted mb-3" />
            <h5 className="fw-bold">Bạn chưa đăng ký khóa học nào</h5>
            <p className="text-muted small mb-4">Hãy khám phá thư viện khóa học và bắt đầu lộ trình học tập của bạn.</p>
            <Button as={Link} to="/courses" variant="primary" size="lg" className="fw-bold">
              Khám phá ngay
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Row className="g-4">
          {enrollments.map((item) => {
            const course = item.courseId;
            if (!course) return null;
            return (
              <Col key={item._id} md={6} lg={4}>
                <Card className="course-card d-flex flex-column h-100 border rounded-4">
                  <Card.Img
                    variant="top"
                    src={course.thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=60'}
                    style={{ height: '180px', objectFit: 'cover' }}
                  />
                  <Card.Body className="d-flex flex-column p-4">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <Badge bg="primary">{course.category?.name || 'Category'}</Badge>
                      <Badge bg="secondary">{course.level}</Badge>
                    </div>

                    <Card.Title className="fw-bold fs-5 text-dark mb-2 line-clamp-2">
                      {course.title}
                    </Card.Title>

                    <p className="text-muted small mb-3 flex-grow-1 text-truncate-3">
                      {course.description}
                    </p>

                    <div className="extra-small text-muted mb-3 d-flex align-items-center gap-1 border-top pt-2">
                      <Calendar size={14} className="text-primary" />
                      <span>Ngày đăng ký: {new Date(item.enrolledAt).toLocaleDateString('vi-VN')}</span>
                    </div>

                    <Button as={Link} to={`/courses/${course._id}`} variant="primary" className="w-100 fw-bold d-flex align-items-center justify-content-center gap-2">
                      Vào bài học ngay <ArrowRight size={16} />
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
    </Container>
  );
};

export default MyCourses;
