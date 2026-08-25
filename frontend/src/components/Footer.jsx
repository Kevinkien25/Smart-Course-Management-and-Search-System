import React from 'react';
import { Container, Row, Col, Badge } from 'react-bootstrap';
import { BookOpen, Code, Terminal, CheckCircle2 } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-5 mt-auto border-top border-secondary">
      <Container>
        <Row className="gy-4">
          <Col lg={4}>
            <div className="d-flex align-items-center gap-2 fs-4 fw-extrabold mb-3 text-primary">
              <BookOpen size={28} /> EduSmart
            </div>
            <p className="text-light opacity-90 small mb-3 leading-relaxed" style={{ fontSize: '0.9rem' }}>
              Hệ thống quản lý và tìm kiếm khóa học trực tuyến thông minh. Sử dụng 100% JavaScript và thuật toán Rule-Based Search Ranking tối ưu.
            </p>
            <div className="d-flex flex-wrap gap-2">
              <Badge bg="primary" className="px-2 py-1 fs-6">Node.js</Badge>
              <Badge bg="info" text="dark" className="px-2 py-1 fs-6">ExpressJS</Badge>
              <Badge bg="success" className="px-2 py-1 fs-6">MongoDB</Badge>
              <Badge bg="warning" text="dark" className="px-2 py-1 fs-6">ReactJS</Badge>
            </div>
          </Col>

          <Col lg={4}>
            <h6 className="fw-bold mb-3 text-warning">Thuật toán Tìm kiếm Rule-Based (No ML)</h6>
            <ul className="list-unstyled text-light small lh-lg mb-0" style={{ fontSize: '0.9rem' }}>
              <li className="mb-1"><CheckCircle2 size={16} className="text-success me-2" /><strong className="text-white">Exact Match Title:</strong> +8 điểm</li>
              <li className="mb-1"><CheckCircle2 size={16} className="text-success me-2" /><strong className="text-white">Title Term Match:</strong> +5 điểm / từ</li>
              <li className="mb-1"><CheckCircle2 size={16} className="text-success me-2" /><strong className="text-white">Description Match:</strong> +2 điểm / từ</li>
              <li className="mb-1"><CheckCircle2 size={16} className="text-success me-2" /><strong className="text-white">Category Match:</strong> +3 điểm</li>
              <li className="mb-1"><CheckCircle2 size={16} className="text-success me-2" /><strong className="text-white">Rating & Log Students Boost:</strong> Cộng điểm tự động</li>
            </ul>
          </Col>

          <Col lg={4}>
            <h6 className="fw-bold mb-3 text-warning">Thông Tin Dự Án</h6>
            <p className="text-light small mb-2 d-flex align-items-center" style={{ fontSize: '0.9rem' }}>
              <Code size={18} className="me-2 text-info flex-shrink-0" />
              <span>Full-Stack JavaScript & System Design</span>
            </p>
            <p className="text-light small mb-3 d-flex align-items-center" style={{ fontSize: '0.9rem' }}>
              <Terminal size={18} className="me-2 text-info flex-shrink-0" />
              <span>Strict Non-AI / Non-Python Implementation</span>
            </p>
            <p className="text-white-50 extra-small pt-2 border-top border-secondary mb-0">
              &copy; {new Date().getFullYear()} EduSmart Course Management System. All rights reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
