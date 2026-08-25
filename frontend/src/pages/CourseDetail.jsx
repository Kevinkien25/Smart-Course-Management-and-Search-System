import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, Button, Spinner, Alert } from 'react-bootstrap';
import { Star, Users, Award, CheckCircle2, ShieldCheck, ArrowLeft, BookOpen, Bot, Sparkles } from 'lucide-react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [message, setMessage] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // AI Summary State
  const [aiSummary, setAiSummary] = useState(null);
  const [loadingAiSummary, setLoadingAiSummary] = useState(false);

  useEffect(() => {
    const fetchCourseAndStatus = async () => {
      try {
        const res = await API.get(`/courses/${id}`);
        if (res.data.success) {
          const cData = res.data.data;
          setCourse(cData);

          // Fetch OpenAI Course Summary
          setLoadingAiSummary(true);
          try {
            const aiRes = await API.post('/ai/summarize', {
              title: cData.title,
              description: cData.description
            });
            if (aiRes.data.success) {
              setAiSummary(aiRes.data.data);
            }
          } catch (err) {
            console.error('[CourseDetail]: AI Summarize error:', err);
          } finally {
            setLoadingAiSummary(false);
          }
        }

        // Check if user is already enrolled
        if (user) {
          const enrollRes = await API.get('/enrollments');
          if (enrollRes.data.success) {
            const isAlreadyEnrolled = enrollRes.data.data.some(
              (item) => item.courseId && item.courseId._id === id
            );
            setEnrolled(isAlreadyEnrolled);
          }
        }
      } catch (error) {
        console.error('[CourseDetail]: Error loading details:', error);
        setErrorMsg('Không thể tải thông tin khóa học.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAndStatus();
  }, [id, user]);

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/courses/${id}` } } });
      return;
    }

    setEnrolling(true);
    setMessage(null);
    setErrorMsg(null);

    try {
      const res = await API.post('/enrollments', { courseId: id });
      if (res.data.success) {
        setEnrolled(true);
        setMessage('Đăng ký khóa học thành công! Bạn có thể bắt đầu học ngay bây giờ.');
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Đăng ký thất bại.';
      setErrorMsg(msg);
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (!course) {
    return (
      <Container className="py-5 text-center">
        <h4>Không tìm thấy khóa học</h4>
        <Button as={Link} to="/courses" variant="primary" className="mt-3">
          Quay lại danh sách khóa học
        </Button>
      </Container>
    );
  }

  const formattedPrice = course.price === 0 
    ? 'Miễn phí' 
    : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price);

  return (
    <div>
      {/* Course Detail Banner */}
      <div className="bg-dark text-white py-5">
        <Container>
          <Button as={Link} to="/courses" variant="outline-light" size="sm" className="mb-4 d-inline-flex align-items-center gap-1">
            <ArrowLeft size={16} /> Quay lại danh sách
          </Button>

          <Row className="align-items-center g-4">
            <Col lg={8}>
              <div className="d-flex align-items-center gap-2 mb-3">
                <Badge bg="primary">{course.category?.name || 'Category'}</Badge>
                <Badge bg="secondary">{course.level}</Badge>
              </div>
              <h1 className="fw-bold mb-3">{course.title}</h1>
              <p className="lead opacity-90 mb-4">{course.description}</p>

              <div className="d-flex flex-wrap gap-4 text-light small">
                <div className="d-flex align-items-center gap-1 text-warning fw-bold">
                  <Star size={18} fill="#f59e0b" color="#f59e0b" />
                  <span>{course.rating ? course.rating.toFixed(1) : '4.8'} / 5.0</span>
                </div>
                <div className="d-flex align-items-center gap-1">
                  <Users size={18} className="text-info" />
                  <span>{course.students || 0} học viên đã tham gia</span>
                </div>
                <div className="d-flex align-items-center gap-1">
                  <Award size={18} className="text-success" />
                  <span>Giảng viên: {course.instructor}</span>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Course Main Body */}
      <Container className="py-5">
        <Row className="g-4">
          <Col lg={8}>
            {message && <Alert variant="success" dismissible onClose={() => setMessage(null)}>{message}</Alert>}
            {errorMsg && <Alert variant="danger" dismissible onClose={() => setErrorMsg(null)}>{errorMsg}</Alert>}

            {/* OpenAI Course Summary Card */}
            <Card className="border-0 shadow-sm rounded-4 mb-4" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: 'white' }}>
              <Card.Body className="p-4">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="d-flex align-items-center gap-2 text-warning fw-bold fs-5">
                    <Bot size={24} />
                    <span>OpenAI Smart Course Summary</span>
                    <Badge bg="success" className="ms-1 fs-6">Live OpenAI API ⚡</Badge>
                  </div>
                  {loadingAiSummary && <Spinner animation="border" size="sm" variant="warning" />}
                </div>

                {aiSummary ? (
                  <div>
                    <h6 className="fw-semibold text-info mb-2 d-flex align-items-center gap-1">
                      <Sparkles size={16} /> Key Highlights (Tóm tắt từ OpenAI GPT):
                    </h6>
                    <ul className="mb-3 small text-light lh-lg">
                      {aiSummary.highlights.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>

                    <div className="bg-dark bg-opacity-50 p-3 rounded-3 border border-secondary border-opacity-50">
                      <span className="small text-warning fw-bold">🎯 Đối tượng phù hợp: </span>
                      <span className="small text-light">{aiSummary.targetAudience}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted small mb-0">Đang tạo tóm tắt thông minh từ OpenAI...</p>
                )}
              </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm rounded-4 mb-4">
              <Card.Body className="p-4">
                <h4 className="fw-bold text-dark mb-3">Bạn sẽ học được gì?</h4>
                <Row className="g-3">
                  {[
                    'Nắm vững kiến thức nền tảng & thực hành dự án thực tế',
                    'Thiết kế kiến trúc hệ thống chuẩn RESTful API',
                    'Tối ưu hiệu năng và xử lý dữ liệu với Mongoose MongoDB',
                    'Được giảng viên trực tiếp hỗ trợ & nhận chứng chỉ hoàn thành'
                  ].map((item, idx) => (
                    <Col md={6} key={idx}>
                      <div className="d-flex align-items-start gap-2">
                        <CheckCircle2 size={20} className="text-success flex-shrink-0 mt-1" />
                        <span className="small text-secondary">{item}</span>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm rounded-4">
              <Card.Body className="p-4">
                <h4 className="fw-bold text-dark mb-3">Chi tiết về khóa học</h4>
                <p className="text-muted leading-relaxed mb-4">{course.description}</p>
                <div className="bg-light p-3 rounded-3">
                  <h6 className="fw-bold mb-2 text-primary">Thông tin học phần</h6>
                  <ul className="mb-0 small text-muted lh-lg">
                    <li><strong>Giảng viên phụ trách:</strong> {course.instructor}</li>
                    <li><strong>Danh mục chuyên môn:</strong> {course.category?.name}</li>
                    <li><strong>Cấp độ học:</strong> {course.level}</li>
                    <li><strong>Ngày phát hành:</strong> {new Date(course.createdAt).toLocaleDateString('vi-VN')}</li>
                  </ul>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Right Enrollment Sticky Box */}
          <Col lg={4}>
            <Card className="border-0 shadow-sm rounded-4 sticky-top" style={{ top: '90px' }}>
              <Card.Img
                variant="top"
                src={course.thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=60'}
                className="rounded-top-4"
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <Card.Body className="p-4">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <span className="text-muted small">Học phí trọn gói:</span>
                  <span className="fs-3 fw-bold text-primary">{formattedPrice}</span>
                </div>

                {enrolled ? (
                  <Button variant="success" size="lg" className="w-100 fw-bold mb-3" disabled>
                    <CheckCircle2 size={20} className="me-2" /> Đã đăng ký khóa học
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-100 fw-bold mb-3"
                    onClick={handleEnroll}
                    disabled={enrolling}
                  >
                    {enrolling ? <Spinner animation="border" size="sm" /> : 'Đăng ký ngay'}
                  </Button>
                )}

                <div className="border-top pt-3">
                  <div className="d-flex align-items-center gap-2 text-muted small mb-2">
                    <ShieldCheck size={16} className="text-success" />
                    <span>Truy cập trọn đời tất cả bài học</span>
                  </div>
                  <div className="d-flex align-items-center gap-2 text-muted small">
                    <BookOpen size={16} className="text-primary" />
                    <span>Thực hành và nhận phản hồi trực tiếp</span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CourseDetail;
