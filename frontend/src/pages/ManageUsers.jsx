import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Spinner } from 'react-bootstrap';
import { Users, ShieldCheck, User as UserIcon } from 'lucide-react';
import API from '../services/api';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/admin/users')
      .then((res) => {
        if (res.data.success) {
          setUsers(res.data.data);
        }
      })
      .catch((err) => console.error('[ManageUsers]: Error fetching users:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
            <Users className="text-primary" /> Quản Lý Người Dùng
          </h3>
          <p className="text-muted small mb-0">Danh sách các tài khoản người dùng và quản trị viên đã đăng ký</p>
        </div>
      </div>

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
                  <th>Họ và Tên</th>
                  <th>Địa chỉ Email</th>
                  <th>Vai Trò (Role)</th>
                  <th>Ngày Tham Gia</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user._id}>
                    <td className="ps-4 fw-bold text-secondary">{index + 1}</td>
                    <td className="fw-semibold text-dark">{user.name}</td>
                    <td className="small text-muted">{user.email}</td>
                    <td>
                      {user.role === 'admin' ? (
                        <Badge bg="danger" className="d-inline-flex align-items-center gap-1 fs-6 px-3 py-1">
                          <ShieldCheck size={14} /> Admin
                        </Badge>
                      ) : (
                        <Badge bg="info" className="d-inline-flex align-items-center gap-1 fs-6 px-3 py-1">
                          <UserIcon size={14} /> User
                        </Badge>
                      )}
                    </td>
                    <td className="small text-muted">
                      {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                    </td>
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

export default ManageUsers;
