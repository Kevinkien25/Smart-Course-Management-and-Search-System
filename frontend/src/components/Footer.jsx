import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { BookOpen, Code, Terminal, CheckCircle2 } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-5 mt-auto">
      <Container>
        <Row className="gy-4">
          <Col lg={4}>
            <div className="d-flex align-items-center gap-2 fs-4 fw-bold mb-3 text-primary">
              <BookOpen size={24} /> EduSmart
            </div>
            <p className="text-muted small mb-3">
              Hệ thống quản lý và tìm kiếm khóa học trực tuyến thông minh. Sử dụng 100% JavaScript và thuật toán Rule-Based Search Ranking tối ưu.
            </p>
            <div className="d-flex gap-2">
              <span className="badge bg-secondary-subtle text-secondary border border-secondary">Node.js</span>
              <span className="badge bg-secondary-subtle text-secondary border border-secondary">ExpressJS</span>
              <span className="badge bg-secondary-subtle text-secondary border border-secondary">MongoDB</span>
              <span className="badge bg-secondary-subtle text-secondary border border-secondary">ReactJS</span>
            </div>
          </Col>

          <Col lg={4}>
            <h6 className="fw-bold mb-3 text-light">Thuật toán Tìm kiếm Rule-Based (No ML)</h6>
            <ul className="list-unstyled text-muted small lh-lg">
              <li><CheckCircle2 size={14} className="text-success me-1" /> Exact Match Title: +8 điểm</li>
              <li><CheckCircle2 size={14} className="text-success me-1" /> Title Term Match: +5 điểm / từ</li>
              <li><CheckCircle2 size={14} className="text-success me-1" /> Description Term Match: +2 điểm / từ</li>
              <li><CheckCircle2 size={14} className="text-success me-1" /> Category Term Match: +3 điểm</li>
              <li><CheckCircle2 size={14} className="text-success me-1" /> Rating Boost & Student Log Popularity</li>
            </ul>
          </Col>

          <Col lg={4}>
            <h6 className="fw-bold mb-3 text-light">Project Metadata</h6>
            <p className="text-muted small mb-2">
              <Code size={16} className="me-2 text-info" />
              Developer Project: System Design & Rule Ranking
            </p>
            <p className="text-muted small mb-2">
              <Terminal size={16} className="me-2 text-info" />
              Strict Non-AI / Non-Python Implementation
            </p>
            <p className="text-muted small text-light">
              &copy; {new Date().getFullYear()} EduSmart Course Management System. All rights reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
