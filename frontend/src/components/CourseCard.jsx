import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Star, Users, Award, Tag } from 'lucide-react';

const CourseCard = ({ course, score, matchedFields }) => {
  const { _id, title, description, instructor, category, level, price, rating, students, thumbnail } = course;

  const formattedPrice = price === 0 
    ? 'Miễn phí' 
    : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  const levelBadgeColor = 
    level === 'Beginner' ? 'success' :
    level === 'Intermediate' ? 'primary' : 'warning';

  return (
    <Card className="course-card d-flex flex-column">
      <div className="position-relative">
        <Card.Img 
          variant="top" 
          src={thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=60'} 
          className="course-thumbnail"
          alt={title} 
        />
        <Badge bg={levelBadgeColor} className="position-absolute top-0 start-0 m-3 px-3 py-2 shadow-sm fs-6">
          {level}
        </Badge>
        
        {score !== undefined && score > 0 && (
          <span className="badge-relevance position-absolute top-0 end-0 m-3 shadow-sm">
            Match Score: {score} pts
          </span>
        )}
      </div>

      <Card.Body className="d-flex flex-column p-4">
        <div className="d-flex align-items-center gap-2 mb-2">
          <Badge bg="light" text="dark" className="border d-flex align-items-center gap-1">
            <Tag size={12} className="text-primary" />
            {category?.name || 'Chưa phân loại'}
          </Badge>
        </div>

        <Card.Title className="fw-bold fs-5 text-dark line-clamp-2 mb-2" style={{ minHeight: '3rem' }}>
          {title}
        </Card.Title>

        <p className="text-muted small mb-3 flex-grow-1 text-truncate-3" style={{ fontSize: '0.875rem' }}>
          {description}
        </p>

        {matchedFields && matchedFields.length > 0 && (
          <div className="mb-3">
            <span className="small text-muted me-1 fw-semibold">Khớp từ khóa:</span>
            {matchedFields.map((field, idx) => (
              <span key={idx} className="badge-field-match">
                {field}
              </span>
            ))}
          </div>
        )}

        <div className="d-flex align-items-center justify-content-between small text-muted mb-3 pt-2 border-top">
          <div className="d-flex align-items-center gap-1 text-warning fw-semibold">
            <Star size={16} fill="#f59e0b" color="#f59e0b" />
            <span>{rating ? rating.toFixed(1) : '4.5'}</span>
          </div>
          <div className="d-flex align-items-center gap-1">
            <Users size={16} className="text-secondary" />
            <span>{students || 0} học viên</span>
          </div>
          <div className="fw-bold text-secondary">
            {instructor}
          </div>
        </div>

        <div className="d-flex align-items-center justify-content-between pt-2">
          <div className="fs-5 fw-bold text-primary">
            {formattedPrice}
          </div>
          <Button as={Link} to={`/courses/${_id}`} variant="outline-primary" size="sm" className="fw-semibold px-3">
            Xem chi tiết
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default CourseCard;
