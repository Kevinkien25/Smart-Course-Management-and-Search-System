import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown, Button, Badge } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { Search, BookOpen, User, LogOut, LayoutDashboard, History, ShieldCheck } from 'lucide-react';

const NavigationBar = () => {
  const { user, logout, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar bg="white" expand="lg" className="shadow-sm sticky-top py-3">
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2 fw-bold text-primary fs-4">
          <BookOpen className="text-primary" size={28} />
          <span>EduSmart</span>
          <span className="badge bg-primary-subtle text-primary border border-primary-subtle fs-6 rounded-pill">
            Rule-Based Search
          </span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto ms-lg-4">
            <Nav.Link as={Link} to="/" active={location.pathname === '/'}>
              Trang chủ
            </Nav.Link>
            <Nav.Link as={Link} to="/courses" active={location.pathname.startsWith('/courses')}>
              <Search size={16} className="me-1" /> Tìm kiếm khóa học
            </Nav.Link>
          </Nav>

          <Nav className="align-items-lg-center gap-2">
            {user ? (
              <>
                {isAdmin ? (
                  <Button as={Link} to="/admin" variant="warning" size="sm" className="fw-semibold text-dark d-flex align-items-center gap-1 me-2">
                    <ShieldCheck size={16} /> Admin Portal
                  </Button>
                ) : (
                  <Nav.Link as={Link} to="/my-courses" active={location.pathname === '/my-courses'}>
                    Khóa học của tôi
                  </Nav.Link>
                )}

                <NavDropdown
                  title={
                    <span className="d-inline-flex align-items-center gap-2 fw-semibold text-dark">
                      <User size={18} className="text-primary" />
                      {user.name}
                      <Badge bg={isAdmin ? 'danger' : 'info'} className="ms-1">
                        {user.role}
                      </Badge>
                    </span>
                  }
                  id="user-nav-dropdown"
                  align="end"
                >
                  <NavDropdown.Item as={Link} to={isAdmin ? "/admin" : "/dashboard"}>
                    <LayoutDashboard size={16} className="me-2" />
                    Dashboard
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/search-history">
                    <History size={16} className="me-2" />
                    Lịch sử tìm kiếm
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout} className="text-danger">
                    <LogOut size={16} className="me-2" />
                    Đăng xuất
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Button as={Link} to="/login" variant="outline-primary" className="fw-semibold">
                  Đăng nhập
                </Button>
                <Button as={Link} to="/register" variant="primary" className="fw-semibold">
                  Đăng ký
                </Button>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
