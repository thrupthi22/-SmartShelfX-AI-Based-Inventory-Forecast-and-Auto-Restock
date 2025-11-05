// In src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// --- COMPONENT IMPORTS ---
import RegisterPage from './components/RegisterPage';
import LoginPage from './components/LoginPage';
import DashboardPage from './components/DashboardPage'; // Manager Dashboard
import AdminDashboard from './components/AdminDashboard'; // Admin Dashboard
import UserDashboard from './components/UserDashboard'; // User Dashboard
import ProtectedRoute from './components/ProtectedRoute'; // Our security component

function App() {
  return (
    <Router>
      <Routes>
        {/* --- Public Routes --- */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* --- Protected Routes --- */}

        {/* Store Manager Dashboard (and Admin) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['STORE_MANAGER', 'ADMIN']}>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Dashboard */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* User Dashboard (Everyone can see their own) */}
        <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute allowedRoles={['USER', 'STORE_MANAGER', 'ADMIN']}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        {/* --- Default Route --- */}
        {/* We now send the root path to the login page */}
        <Route path="/" element={<LoginPage />} />

        {/* You can add a 404 Not Found page here later */}
      </Routes>
    </Router>
  );
}

export default App;