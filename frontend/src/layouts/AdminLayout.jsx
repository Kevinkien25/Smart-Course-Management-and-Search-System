import React, { useContext } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Container, Row, Col, Nav, Navbar, Button } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  BookOpen, 
  Layers, 
  Users, 
  LogOut, 
  ArrowLeft,
  ShieldCheck 
} from 'lucide-react';

const AdminLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      <Navbar bg="dark" variant="dark" expand="lg" className="px-3 shadow-sm">
        <Container fluid>
          <Navbar.Brand as={Link} to="/admin" className="d-flex align-items-center gap-2 fw-bold text-warning fs-5">
            <ShieldCheck size={24} /> Admin Dashboard
          </Navbar.Brand>
          <div className="d-flex align-items-center gap-3">
            <Button as={Link} to="/" variant="outline-light" size="sm" className="d-flex align-items-center gap-1">
              <ArrowLeft size={16} /> Về trang chủ
            </Button>
            <span className="text-white small fw-semibold">
              {user?.name}
            </span>
            <Button onClick={logout} variant="danger" size="sm" className="d-flex align-items-center gap-1">
              <LogOut size={16} /> Thoát
            </Button>
          </div>
        </Container>
      </Navbar>

      <Container fluid className="flex-grow-1 p-0">
        <Row className="g-0 min-vh-100">
          <Col md={3} lg={2} className="sidebar-admin p-3 border-end border-secondary">
            <div className="text-uppercase text-muted fw-bold small mb-3 px-2" style={{ letterSpacing: '1px' }}>
              Quản trị hệ thống
            </div>
            <Nav className="flex-column gap-1">
              <Nav.Link as={Link} to="/admin" active={location.pathname === '/admin'}>
                <LayoutDashboard size={18} /> Tổng quan (Stats)
              </Nav.Link>
              <Nav.Link as={Link} to="/admin/courses" active={location.pathname.startsWith('/admin/courses')}>
                <BookOpen size={18} /> Quản lý Khóa học
              </Nav.Link>
              <Nav.Link as={Link} to="/admin/categories" active={location.pathname === '/admin/categories'}>
                <Layers size={18} /> Quản lý Danh mục
              </Nav.Link>
              <Nav.Link as={Link} to="/admin/users" active={location.pathname === '/admin/users'}>
                <Users size={18} /> Quản lý Người dùng
              </Nav.Link>
            </Nav>
          </Col>

          <Col md={9} lg={10} className="p-4 bg-light">
            <Outlet />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminLayout;
