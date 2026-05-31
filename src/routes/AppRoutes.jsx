import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import CountryDetail from '../pages/CountryDetail';
import BucketList from '../pages/BucketList';

/**
 * Global application routes configuration.
 * Groups public and private pages using ProtectedRoute.
 */
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/country/:code"
        element={
          <ProtectedRoute>
            <CountryDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/bucket-list"
        element={
          <ProtectedRoute>
            <BucketList />
          </ProtectedRoute>
        }
      />

      {/* Fallback Redirection */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
