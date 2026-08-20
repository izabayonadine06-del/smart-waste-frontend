import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Public
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';

// Admin
import AdminDashboard from '../pages/AdminDashboard';

// Citizen
import CitizenDashboard from '../pages/CitizenDashboard';
import ReportWaste from '../pages/ReportWaste';
import MyReports from '../pages/MyReports';
import CitizenCollections from '../pages/CitizenCollections';
import Notifications from '../pages/Notifications';
import Feedback from '../pages/Feedback';

// Driver
import DriverDashboard from '../pages/DriverDashboard';
import DriverCollections from '../pages/DriverCollections';
import DriverNotifications from '../pages/DriverNotifications';
import DriverFeedback from '../pages/DriverFeedback';


// ===============================
// Get logged-in user
// ===============================
const getUser = () => {
  try {
    const user = localStorage.getItem('user');

    if (!user) {
      return null;
    }

    return JSON.parse(user);
  } catch (error) {
    console.error('Invalid user data:', error);
    return null;
  }
};


// ===============================
// Get dashboard according to role
// ===============================
const getDashboard = (user) => {
  if (!user) {
    return '/login';
  }

  const role = user.role?.toLowerCase();

  if (role === 'admin') {
    return '/admin/dashboard';
  }

  if (role === 'driver') {
    return '/driver/dashboard';
  }

  if (role === 'citizen' || role === 'user') {
    return '/citizen/dashboard';
  }

  return '/login';
};


// ===============================
// Protected Route
// ===============================
const ProtectedRoute = ({ children, roles }) => {
  const token = localStorage.getItem('token');
  const user = getUser();

  // Not logged in
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  const role = user.role?.toLowerCase();

  // Wrong role
  if (roles && !roles.includes(role)) {
    return (
      <Navigate
        to={getDashboard(user)}
        replace
      />
    );
  }

  return children;
};


// ===============================
// Auth Route
// ===============================
const AuthRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = getUser();

  // Already logged in
  if (token && user) {
    return (
      <Navigate
        to={getDashboard(user)}
        replace
      />
    );
  }

  return children;
};


// ===============================
// Root Route
// ===============================
const RootRoute = () => {
  const token = localStorage.getItem('token');
  const user = getUser();

  // Not logged in
  // Show Introduction/Home
  if (!token || !user) {
    return <Home />;
  }

  // Logged in
  // Go to correct dashboard
  return (
    <Navigate
      to={getDashboard(user)}
      replace
    />
  );
};


// ===============================
// APP ROUTES
// ===============================
const AppRoutes = () => {
  return (
    <Routes>

      {/* ================= PUBLIC ================= */}

      <Route
        path="/"
        element={<RootRoute />}
      />

      <Route
        path="/login"
        element={
          <AuthRoute>
            <Login />
          </AuthRoute>
        }
      />

      <Route
        path="/register"
        element={
          <AuthRoute>
            <Register />
          </AuthRoute>
        }
      />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      <Route
        path="/reset-password/:token"
        element={<ResetPassword />}
      />


      {/* ================= ADMIN ================= */}

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute roles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />


      {/* ================= CITIZEN ================= */}

      <Route
        path="/citizen/dashboard"
        element={
          <ProtectedRoute roles={['citizen', 'user']}>
            <CitizenDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/citizen/report-waste"
        element={
          <ProtectedRoute roles={['citizen', 'user']}>
            <ReportWaste />
          </ProtectedRoute>
        }
      />

      <Route
        path="/citizen/my-reports"
        element={
          <ProtectedRoute roles={['citizen', 'user']}>
            <MyReports />
          </ProtectedRoute>
        }
      />

      <Route
        path="/citizen/collections"
        element={
          <ProtectedRoute roles={['citizen', 'user']}>
            <CitizenCollections />
          </ProtectedRoute>
        }
      />

      <Route
        path="/citizen/notifications"
        element={
          <ProtectedRoute roles={['citizen', 'user']}>
            <Notifications />
          </ProtectedRoute>
        }
      />

      <Route
        path="/citizen/feedback"
        element={
          <ProtectedRoute roles={['citizen', 'user']}>
            <Feedback />
          </ProtectedRoute>
        }
      />


      {/* ================= DRIVER ================= */}

      <Route
        path="/driver/dashboard"
        element={
          <ProtectedRoute roles={['driver']}>
            <DriverDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/driver/collections"
        element={
          <ProtectedRoute roles={['driver']}>
            <DriverCollections />
          </ProtectedRoute>
        }
      />

      <Route
        path="/driver/notifications"
        element={
          <ProtectedRoute roles={['driver']}>
            <DriverNotifications />
          </ProtectedRoute>
        }
      />

      <Route
        path="/driver/feedback"
        element={
          <ProtectedRoute roles={['driver']}>
            <DriverFeedback />
          </ProtectedRoute>
        }
      />


      {/* ================= 404 ================= */}

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />

    </Routes>
  );
};

export default AppRoutes;