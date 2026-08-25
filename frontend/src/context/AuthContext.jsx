import React, { createContext, useState, useEffect } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('course_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('course_token') || '');
  const [loading, setLoading] = useState(true);

  // Sync auth status with backend on mount
  useEffect(() => {
    const fetchMe = async () => {
      if (token) {
        try {
          const res = await API.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.data);
            localStorage.setItem('course_user', JSON.stringify(res.data.data));
          }
        } catch (error) {
          console.error('[AuthContext]: Error fetching profile:', error);
          logout();
        }
      }
      setLoading(false);
    };

    fetchMe();
  }, [token]);

  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    if (res.data.success) {
      const { token: newToken, user: userData } = res.data.data;
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('course_token', newToken);
      localStorage.setItem('course_user', JSON.stringify(userData));
      return res.data;
    }
  };

  const register = async (name, email, password, role) => {
    const res = await API.post('/auth/register', { name, email, password, role });
    if (res.data.success) {
      const { token: newToken, user: userData } = res.data.data;
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('course_token', newToken);
      localStorage.setItem('course_user', JSON.stringify(userData));
      return res.data;
    }
  };

  const logout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('course_token');
    localStorage.removeItem('course_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAdmin: user?.role === 'admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
