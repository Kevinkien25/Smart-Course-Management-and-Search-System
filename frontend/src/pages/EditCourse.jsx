import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, Form, Button, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { ArrowLeft, Save } from 'lucide-react';
import API from '../services/api';

const EditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [instructor, setInstructor] = useState('');
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState('Beginner');
  const [price, setPrice] = useState('0');
  const [rating, setRating] = useState('0');
  const [students, setStudents] = useState('0');
  const [thumbnail, setThumbnail] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, courseRes] = await Promise.all([
          API.get('/categories'),
          API.get(`/courses/${id}`)
        ]);

        if (catRes.data.success) setCategories(catRes.data.data);

        if (courseRes.data.success) {
          const c = courseRes.data.data;
          setTitle(c.title);
          setDescription(c.description);
          setInstructor(c.instructor);
          setCategory(c.category?._id || '');
          setLevel(c.level);
          setPrice(c.price.toString());
          setRating(c.rating.toString());
          setStudents(c.students.toString());
          setThumbnail(c.thumbnail);
        }
      } catch (err) {
        console.error('[EditCourse]: Error loading course:', err);
        setErrorMsg('Không thể tải dữ liệu khóa học.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    setSubmitting(true);
    try {
      const res = await API.put(`/courses/${id}`, {
        title,
        description,
        instructor,
        category,
        level,
        price: Number(price),
        rating: Number(rating),
        students: Number(students),
        thumbnail
      });

      if (res.data.success) {
        navigate('/admin/courses');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Cập nhật khóa học không thành công.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex align-items-center gap-3 mb-4">
        <Button as={Link} to="/admin/courses" variant="outline-secondary" size="sm">
          <ArrowLeft size={16} /> Quay lại
        </Button>
        <h3 className="fw-bold text-dark mb-0">Cập Nhật Khóa Học</h3>
      </div>

      {errorMsg && <Alert variant="danger" dismissible onClose={() => setErrorMsg('')}>{errorMsg}</Alert>}

      <Card className="border-0 shadow-sm rounded-4">
        <Card.Body className="p-4">
          <Form onSubmit={handleSubmit}>
            <Row className="g-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-semibold small">Tiêu Đề Khóa Học *</Form.Label>
                  <Form.Control
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-semibold small">Mô Tả Chi Tiết *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold small">Giảng Viên *</Form.Label>
                  <Form.Control
                    type="text"
                    value={instructor}
                    onChange={(e) => setInstructor(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold small">Danh Mục Khóa Học *</Form.Label>
                  <Form.Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  >
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group>
                  <Form.Label className="fw-semibold small">Trình Độ</Form.Label>
                  <Form.Select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group>
                  <Form.Label className="fw-semibold small">Học Phí (VNĐ)</Form.Label>
                  <Form.Control
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group>
                  <Form.Label className="fw-semibold small">Đánh Giá (Rating)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.1"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                  />
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group>
                  <Form.Label className="fw-semibold small">Số Học Viên</Form.Label>
                  <Form.Control
                    type="number"
                    value={students}
                    onChange={(e) => setStudents(e.target.value)}
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-semibold small">URL Thumbnail</Form.Label>
                  <Form.Control
                    type="url"
                    value={thumbnail}
                    onChange={(e) => setThumbnail(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <hr className="my-4" />

            <div className="d-flex justify-content-end gap-2">
              <Button as={Link} to="/admin/courses" variant="outline-secondary">
                Hủy bỏ
              </Button>
              <Button type="submit" variant="primary" className="fw-bold d-flex align-items-center gap-2" disabled={submitting}>
                <Save size={18} /> {submitting ? 'Đang lưu...' : 'Lưu thay đổi'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default EditCourse;
