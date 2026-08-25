import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Form, Modal, Spinner, Alert } from 'react-bootstrap';
import { PlusCircle, Edit, Trash2, Layers } from 'lucide-react';
import API from '../services/api';

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const [message, setMessage] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const fetchCategories = async () => {
    try {
      const res = await API.get('/categories');
      if (res.data.success) {
        setCategories(res.data.data);
      }
    } catch (error) {
      console.error('[ManageCategories]: Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenModal = (cat = null) => {
    if (cat) {
      setEditingCategory(cat);
      setName(cat.name);
      setDescription(cat.description || '');
    } else {
      setEditingCategory(null);
      setName('');
      setDescription('');
    }
    setErrorMsg(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg('Vui lòng nhập tên danh mục.');
      return;
    }

    try {
      if (editingCategory) {
        const res = await API.put(`/categories/${editingCategory._id}`, { name, description });
        if (res.data.success) {
          setMessage(`Đã cập nhật danh mục "${name}"`);
          fetchCategories();
          handleCloseModal();
        }
      } else {
        const res = await API.post('/categories', { name, description });
        if (res.data.success) {
          setMessage(`Đã tạo mới danh mục "${name}"`);
          fetchCategories();
          handleCloseModal();
        }
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Thao tác không thành công.');
    }
  };

  const handleDelete = async (id, catName) => {
    if (window.confirm(`Bạn có chắc muốn xóa danh mục "${catName}"?`)) {
      try {
        const res = await API.delete(`/categories/${id}`);
        if (res.data.success) {
          setMessage(`Đã xóa danh mục "${catName}"`);
          setCategories(categories.filter(c => c._id !== id));
        }
      } catch (err) {
        console.error('[ManageCategories]: Delete error:', err);
      }
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
            <Layers className="text-primary" /> Quản Lý Danh Mục
          </h3>
          <p className="text-muted small mb-0">Quản lý các danh mục công nghệ phân loại khóa học</p>
        </div>
        <Button variant="primary" className="fw-bold d-flex align-items-center gap-2" onClick={() => handleOpenModal()}>
          <PlusCircle size={18} /> Thêm danh mục mới
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
                  <th>Tên Danh Mục</th>
                  <th>Mô Tả</th>
                  <th>Ngày Tạo</th>
                  <th className="text-end pe-4">Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat, index) => (
                  <tr key={cat._id}>
                    <td className="ps-4 fw-bold text-secondary">{index + 1}</td>
                    <td className="fw-bold text-primary">{cat.name}</td>
                    <td className="small text-muted">{cat.description || 'Chưa có mô tả'}</td>
                    <td className="small text-muted">{new Date(cat.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td className="text-end pe-4">
                      <div className="d-flex justify-content-end gap-1">
                        <Button variant="outline-primary" size="sm" onClick={() => handleOpenModal(cat)} title="Sửa">
                          <Edit size={14} />
                        </Button>
                        <Button variant="outline-danger" size="sm" onClick={() => handleDelete(cat._id, cat.name)} title="Xóa">
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

      {/* Category Add/Edit Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold fs-5">
            {editingCategory ? 'Sửa Danh Mục' : 'Thêm Danh Mục Mới'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold small">Tên Danh Mục *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ví dụ: Node.js"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold small">Mô Tả</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Mô tả tóm tắt..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Hủy
            </Button>
            <Button type="submit" variant="primary" className="fw-bold">
              Lưu
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageCategories;
