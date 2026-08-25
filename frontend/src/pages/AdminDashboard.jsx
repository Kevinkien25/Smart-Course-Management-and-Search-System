import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Spinner, Table, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BookOpen, Users, GraduationCap, Search, PlusCircle, ArrowRight, Layers } from 'lucide-react';
import API from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalUsers: 0,
    totalEnrollments: 0,
    totalSearches: 0
  });
  const [recentCourses, setRecentCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [statsRes, coursesRes] = await Promise.all([
          API.get('/admin/stats'),
          API.get('/courses')
        ]);

        if (statsRes.data.success) {
          setStats(statsRes.data.data);
        }
        if (coursesRes.data.success) {
          setRecentCourses(coursesRes.data.data.slice(0, 5));
        }
      } catch (error) {
        console.error('[AdminDashboard]: Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-1">Thống Kê Hệ Thống (Admin Dashboard)</h3>
          <p className="text-muted small mb-0">Tổng quan chỉ số hoạt động và quản trị dữ liệu</p>
        </div>
        <div className="d-flex gap-2">
          <Button as={Link} to="/admin/courses/create" variant="primary" className="fw-bold d-flex align-items-center gap-2">
            <PlusCircle size={18} /> Thêm khóa học mới
          </Button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <Row className="g-4 mb-4">
        <Col sm={6} xl={3}>
          <Card className="stat-card bg-stat-courses shadow-sm">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-white-50 text-uppercase extra-small fw-bold">Tổng Khóa Học</span>
                <h2 className="fw-extrabold mb-0 mt-1">{loading ? '...' : stats.totalCourses}</h2>
              </div>
              <BookOpen size={40} className="opacity-75" />
            </div>
          </Card>
        </Col>

        <Col sm={6} xl={3}>
          <Card className="stat-card bg-stat-users shadow-sm">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-white-50 text-uppercase extra-small fw-bold">Người Dùng</span>
                <h2 className="fw-extrabold mb-0 mt-1">{loading ? '...' : stats.totalUsers}</h2>
              </div>
              <Users size={40} className="opacity-75" />
            </div>
          </Card>
        </Col>

        <Col sm={6} xl={3}>
          <Card className="stat-card bg-stat-enrollments shadow-sm">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-white-50 text-uppercase extra-small fw-bold">Lượt Đăng Ký Học</span>
                <h2 className="fw-extrabold mb-0 mt-1">{loading ? '...' : stats.totalEnrollments}</h2>
              </div>
              <GraduationCap size={40} className="opacity-75" />
            </div>
          </Card>
        </Col>

        <Col sm={6} xl={3}>
          <Card className="stat-card bg-stat-searches shadow-sm">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-white-50 text-uppercase extra-small fw-bold">Lượt Tìm Kiếm</span>
                <h2 className="fw-extrabold mb-0 mt-1">{loading ? '...' : stats.totalSearches}</h2>
              </div>
              <Search size={40} className="opacity-75" />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Quick Action Shortcuts */}
      <Row className="g-4 mb-4">
        <Col md={4}>
          <Card className="border-0 shadow-sm rounded-4 h-100 p-3 text-center">
            <Card.Body>
              <BookOpen size={36} className="text-primary mb-2" />
              <h5 className="fw-bold">Quản Lý Khóa Học</h5>
              <p className="text-muted extra-small mb-3">Thêm mới, cập nhật giá, chỉnh sửa mô tả và xóa khóa học khỏi hệ thống.</p>
              <Button as={Link} to="/admin/courses" variant="outline-primary" size="sm" className="fw-semibold">
                Quản lý ngay <ArrowRight size={14} />
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="border-0 shadow-sm rounded-4 h-100 p-3 text-center">
            <Card.Body>
              <Layers size={36} className="text-success mb-2" />
              <h5 className="fw-bold">Quản Lý Danh Mục</h5>
              <p className="text-muted extra-small mb-3">Tạo danh mục mới (NodeJS, ReactJS, MongoDB...) để phân loại khóa học.</p>
              <Button as={Link} to="/admin/categories" variant="outline-success" size="sm" className="fw-semibold">
                Quản lý ngay <ArrowRight size={14} />
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="border-0 shadow-sm rounded-4 h-100 p-3 text-center">
            <Card.Body>
              <Users size={36} className="text-warning mb-2" />
              <h5 className="fw-bold">Quản Lý Người Dùng</h5>
              <p className="text-muted extra-small mb-3">Xem danh sách người dùng đăng ký, thông tin email và phân quyền Admin/User.</p>
              <Button as={Link} to="/admin/users" variant="outline-warning" size="sm" className="fw-semibold text-dark">
                Quản lý ngay <ArrowRight size={14} />
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Courses Table */}
      <Card className="border-0 shadow-sm rounded-4">
        <Card.Body className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-0">Khóa Học Mới Tạo Gần Đây</h5>
            <Button as={Link} to="/admin/courses" variant="link" className="text-primary p-0 text-decoration-none small">
              Xem tất cả
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <Table responsive hover className="align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th>Tên Khóa Học</th>
                  <th>Danh Mục</th>
                  <th>Trình Độ</th>
                  <th>Học Phí</th>
                  <th>Học Viên</th>
                  <th>Đánh Giá</th>
                </tr>
              </thead>
              <tbody>
                {recentCourses.map((c) => (
                  <tr key={c._id}>
                    <td className="fw-semibold text-dark">{c.title}</td>
                    <td><Badge bg="primary">{c.category?.name || 'N/A'}</Badge></td>
                    <td><Badge bg="secondary">{c.level}</Badge></td>
                    <td className="fw-bold text-primary">
                      {c.price === 0 ? 'Miễn phí' : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(c.price)}
                    </td>
                    <td>{c.students}</td>
                    <td className="text-warning fw-bold">⭐ {c.rating ? c.rating.toFixed(1) : '4.5'}</td>
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

export default AdminDashboard;
