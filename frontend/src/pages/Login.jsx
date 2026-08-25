import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Container, Card, Form, Button, Alert, Badge } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { LogIn, Key, Mail, ShieldAlert, UserCheck } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Vui lòng nhập đầy đủ email và mật khẩu.');
      return;
    }

    setSubmitting(true);
    try {
      const data = await login(email, password);
      if (data?.user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Đăng nhập không thành công. Kiểm tra lại thông tin.');
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemoAccount = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <Container className="py-5">
      <div className="mx-auto" style={{ maxWidth: '480px' }}>
        <Card className="border-0 shadow-lg rounded-4 p-4">
          <Card.Body>
            <div className="text-center mb-4">
              <div className="bg-primary-subtle text-primary p-3 rounded-circle d-inline-flex mb-2">
                <LogIn size={32} />
              </div>
              <h3 className="fw-bold text-dark mb-1">Đăng Nhập System</h3>
              <p className="text-muted small">Nhập tài khoản để tiếp tục trải nghiệm hệ thống</p>
            </div>

            {errorMsg && <Alert variant="danger" dismissible onClose={() => setErrorMsg('')}>{errorMsg}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold small">Địa chỉ Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="shadow-none"
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="fw-semibold small">Mật khẩu</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="shadow-none"
                />
              </Form.Group>

              <Button type="submit" variant="primary" size="lg" className="w-100 fw-bold mb-3" disabled={submitting}>
                {submitting ? 'Đang xử lý...' : 'Đăng nhập'}
              </Button>
            </Form>

            {/* Quick Demo Fill Buttons */}
            <div className="bg-light p-3 rounded-3 border mt-4">
              <div className="fw-bold extra-small text-uppercase text-secondary mb-2 d-flex align-items-center gap-1">
                <UserCheck size={14} className="text-primary" /> Tài khoản Demo để Test Nhanh:
              </div>
              <div className="d-flex flex-column gap-2">
                <Button
                  variant="outline-warning"
                  size="sm"
                  className="text-start d-flex justify-content-between align-items-center fw-semibold text-dark"
                  onClick={() => fillDemoAccount('admin@system.com', 'admin123')}
                >
                  <span>👑 Admin: admin@system.com</span>
                  <Badge bg="warning" text="dark">Fill Admin</Badge>
                </Button>

                <Button
                  variant="outline-info"
                  size="sm"
                  className="text-start d-flex justify-content-between align-items-center fw-semibold text-dark"
                  onClick={() => fillDemoAccount('nguyenvana@gmail.com', '123456')}
                >
                  <span>👤 User: nguyenvana@gmail.com</span>
                  <Badge bg="info">Fill User</Badge>
                </Button>
              </div>
            </div>

            <div className="text-center mt-4 text-muted small">
              Chưa có tài khoản?{' '}
              <Link to="/register" className="text-primary fw-semibold text-decoration-none">
                Đăng ký ngay
              </Link>
            </div>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
};

export default Login;
