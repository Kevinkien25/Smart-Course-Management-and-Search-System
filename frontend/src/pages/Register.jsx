import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { UserPlus } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name || !email || !password) {
      setErrorMsg('Vui lòng nhập đầy đủ họ tên, email và mật khẩu.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Mật khẩu xác nhận không trùng khớp.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }

    setSubmitting(true);
    try {
      await register(name, email, password, 'user');
      navigate('/');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Đăng ký không thành công. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="py-5">
      <div className="mx-auto" style={{ maxWidth: '480px' }}>
        <Card className="border-0 shadow-lg rounded-4 p-4">
          <Card.Body>
            <div className="text-center mb-4">
              <div className="bg-primary-subtle text-primary p-3 rounded-circle d-inline-flex mb-2">
                <UserPlus size={32} />
              </div>
              <h3 className="fw-bold text-dark mb-1">Tạo Tài Khoản Mới</h3>
              <p className="text-muted small">Bắt đầu tham gia hệ thống khóa học thông minh</p>
            </div>

            {errorMsg && <Alert variant="danger" dismissible onClose={() => setErrorMsg('')}>{errorMsg}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold small">Họ và Tên</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nguyễn Văn A"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="shadow-none"
                />
              </Form.Group>

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

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold small">Mật khẩu</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="shadow-none"
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="fw-semibold small">Xác nhận Mật khẩu</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="shadow-none"
                />
              </Form.Group>

              <Button type="submit" variant="primary" size="lg" className="w-100 fw-bold mb-3" disabled={submitting}>
                {submitting ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
              </Button>
            </Form>

            <div className="text-center mt-3 text-muted small">
              Đã có tài khoản?{' '}
              <Link to="/login" className="text-primary fw-semibold text-decoration-none">
                Đăng nhập ngay
              </Link>
            </div>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
};

export default Register;
