import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { PlusCircle, Edit, Trash2, Eye } from 'lucide-react';
import API from '../services/api';

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  const fetchCourses = async () => {
    try {
      const res = await API.get('/courses');
      if (res.data.success) {
        setCourses(res.data.data);
      }
    } catch (error) {
      console.error('[ManageCourses]: Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (id, title) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa khóa học "${title}"?`)) {
      try {
        const res = await API.delete(`/courses/${id}`);
        if (res.data.success) {
          setMessage(`Đã xóa thành công khóa học "${title}"`);
          setCourses(courses.filter(c => c._id !== id));
        }
      } catch (error) {
        console.error('[ManageCourses]: Delete error:', error);
      }
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-1">Quản Lý Khóa Học</h3>
          <p className="text-muted small mb-0">Danh sách toàn bộ khóa học hiện có trong hệ thống</p>
        </div>
        <Button as={Link} to="/admin/courses/create" variant="primary" className="fw-bold d-flex align-items-center gap-2">
          <PlusCircle size={18} /> Thêm khóa học
        </Button>
      </div>

      {message && <Alert variant="success" dismissible onClose={() => setMessage(null)}>{message}</Alert>}

      <Card className="border-0 shadow-sm rounded-4">
        <Card.Body className="p-0">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <Table responsive hover className="align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="ps-4">#</th>
                  <th>Hình ảnh</th>
                  <th>Tên Khóa Học</th>
                  <th>Giảng Viên</th>
                  <th>Danh Mục</th>
                  <th>Trình Độ</th>
                  <th>Học Phí</th>
                  <th className="text-end pe-4">Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course, index) => (
                  <tr key={course._id}>
                    <td className="ps-4 fw-bold text-secondary">{index + 1}</td>
                    <td>
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        style={{ width: '50px', height: '40px', objectFit: 'cover', borderRadius: '6px' }}
                      />
                    </td>
                    <td>
                      <div className="fw-semibold text-dark mb-1">{course.title}</div>
                      <span className="extra-small text-muted">Rating: ⭐ {course.rating ? course.rating.toFixed(1) : '4.5'} | Học viên: {course.students}</span>
                    </td>
                    <td className="small text-secondary">{course.instructor}</td>
                    <td><Badge bg="primary">{course.category?.name || 'Chưa chọn'}</Badge></td>
                    <td><Badge bg="secondary">{course.level}</Badge></td>
                    <td className="fw-bold text-primary">
                      {course.price === 0 ? 'Miễn phí' : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price)}
                    </td>
                    <td className="text-end pe-4">
                      <div className="d-flex justify-content-end gap-1">
                        <Button as={Link} to={`/courses/${course._id}`} variant="outline-info" size="sm" title="Xem chi tiết">
                          <Eye size={14} />
                        </Button>
                        <Button as={Link} to={`/admin/courses/edit/${course._id}`} variant="outline-primary" size="sm" title="Sửa">
                          <Edit size={14} />
                        </Button>
                        <Button variant="outline-danger" size="sm" onClick={() => handleDelete(course._id, course.title)} title="Xóa">
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default ManageCourses;
