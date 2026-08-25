import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Spinner, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { History, Trash2, Search, Calendar } from 'lucide-react';
import API from '../services/api';

const SearchHistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchHistory = async () => {
    try {
      const res = await API.get('/search-history');
      if (res.data.success) {
        setHistory(res.data.data);
      }
    } catch (error) {
      console.error('[SearchHistoryPage]: Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await API.delete(`/search-history/${id}`);
      if (res.data.success) {
        setHistory(history.filter(item => item._id !== id));
      }
    } catch (error) {
      console.error('[SearchHistoryPage]: Error deleting item:', error);
    }
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
            <History className="text-primary" /> Lịch Sử Tìm Kiếm
          </h3>
          <p className="text-muted small mb-0">Xem lại các từ khóa bạn đã tra cứu trong hệ thống</p>
        </div>
      </div>

      <Card className="border-0 shadow-sm rounded-4">
        <Card.Body className="p-0">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <History size={48} className="text-muted mb-2" />
              <p className="mb-0">Bạn chưa thực hiện lượt tìm kiếm nào.</p>
            </div>
          ) : (
            <Table responsive hover className="align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="ps-4">#</th>
                  <th>Từ Khóa Tìm Kiếm</th>
                  <th>Số Kết Quả Tìm Thấy</th>
                  <th>Thời Gian Tra Cứu</th>
                  <th className="text-end pe-4">Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item, index) => (
                  <tr key={item._id}>
                    <td className="ps-4 fw-bold text-secondary">{index + 1}</td>
                    <td>
                      <span className="fw-semibold text-primary me-2">"{item.keyword}"</span>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="py-0 px-2 extra-small rounded-pill"
                        onClick={() => navigate(`/courses?q=${encodeURIComponent(item.keyword)}`)}
                      >
                        <Search size={12} className="me-1" /> Tìm lại
                      </Button>
                    </td>
                    <td>
                      <Badge bg="info" className="fs-6 px-3 py-1">
                        {item.resultCount} khóa học
                      </Badge>
                    </td>
                    <td className="small text-muted">
                      <span className="d-flex align-items-center gap-1">
                        <Calendar size={14} />
                        {new Date(item.createdAt).toLocaleString('vi-VN')}
                      </span>
                    </td>
                    <td className="text-end pe-4">
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(item._id)}
                        className="d-inline-flex align-items-center gap-1"
                      >
                        <Trash2 size={14} /> Xóa
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default SearchHistoryPage;
