import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { ArrowLeft, Save } from 'lucide-react';
import API from '../services/api';

const CreateCourse = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [instructor, setInstructor] = useState('');
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState('Beginner');
  const [price, setPrice] = useState('0');
  const [rating, setRating] = useState('4.8');
  const [students, setStudents] = useState('0');
  const [thumbnail, setThumbnail] = useState('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=60');

  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    API.get('/categories')
      .then(res => {
        if (res.data.success) {
          setCategories(res.data.data);
          if (res.data.data.length > 0) {
            setCategory(res.data.data[0]._id);
          }
        }
      })
      .catch(err => console.error('[CreateCourse]: Error loading categories:', err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!title || !description || !instructor || !category) {
      setErrorMsg('Vui lòng nhập đầy đủ tiêu đề, mô tả, giảng viên và chọn danh mục.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await API.post('/courses', {
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
      setErrorMsg(err.response?.data?.message || 'Không thể tạo khóa học. Vui lòng kiểm tra lại.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="d-flex align-items-center gap-3 mb-4">
        <Button as={Link} to="/admin/courses" variant="outline-secondary" size="sm">
          <ArrowLeft size={16} /> Quay lại
        </Button>
        <h3 className="fw-bold text-dark mb-0">Thêm Khóa Học Mới</h3>
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
                    placeholder="Ví dụ: NodeJS Backend từ cơ bản đến nâng cao"
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
                    placeholder="Nhập nội dung mô tả đầy đủ khóa học..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold small">Tên Giảng Viên *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nguyễn Văn A"
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

              <Col md={4}>
                <Form.Group>
                  <Form.Label className="fw-semibold small">Trình Độ</Form.Label>
                  <Form.Select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                  >
                    <option value="Beginner">Beginner (Cơ bản)</option>
                    <option value="Intermediate">Intermediate (Trung cấp)</option>
                    <option value="Advanced">Advanced (Nâng cao)</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label className="fw-semibold small">Học Phí (VNĐ)</Form.Label>
                  <Form.Control
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    min="0"
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label className="fw-semibold small">Đánh Giá (Rating 0-5)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-semibold small">URL Hình Ảnh (Thumbnail)</Form.Label>
                  <Form.Control
                    type="url"
                    placeholder="https://images.unsplash.com/..."
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
                <Save size={18} /> {submitting ? 'Đang lưu...' : 'Lưu khóa học'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default CreateCourse;
