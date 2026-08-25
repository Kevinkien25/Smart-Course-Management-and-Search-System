import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Automatic Bearer Token Interceptor
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('course_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor for handling global auth errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Optional: Clear expired token if unauthenticated
      if (localStorage.getItem('course_token')) {
        localStorage.removeItem('course_token');
        localStorage.removeItem('course_user');
      }
    }
    return Promise.reject(error);
  }
);

export default API;
