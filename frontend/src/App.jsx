import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import CourseList from './pages/CourseList';
import CourseDetail from './pages/CourseDetail';
import Login from './pages/Login';
import Register from './pages/Register';

import UserDashboard from './pages/UserDashboard';
import MyCourses from './pages/MyCourses';
import SearchHistoryPage from './pages/SearchHistoryPage';

import AdminDashboard from './pages/AdminDashboard';
import ManageCourses from './pages/ManageCourses';
import CreateCourse from './pages/CreateCourse';
import EditCourse from './pages/EditCourse';
import ManageCategories from './pages/ManageCategories';
import ManageUsers from './pages/ManageUsers';

function App() {
  return (
    <Routes>
      {/* Public & Standard User Layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<CourseList />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* User Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-courses"
          element={
            <ProtectedRoute>
              <MyCourses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search-history"
          element={
            <ProtectedRoute>
              <SearchHistoryPage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Admin Portal Layout */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly={true}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="courses" element={<ManageCourses />} />
        <Route path="courses/create" element={<CreateCourse />} />
        <Route path="courses/edit/:id" element={<EditCourse />} />
        <Route path="categories" element={<ManageCategories />} />
        <Route path="users" element={<ManageUsers />} />
      </Route>

      {/* Catch-all Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
