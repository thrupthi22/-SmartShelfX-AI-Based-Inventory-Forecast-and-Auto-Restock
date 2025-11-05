// In src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  if (!token) {
    // 1. If no token, not logged in
    return <Navigate to="/login" replace />; // 'replace' is good practice
  }

  if (!allowedRoles || !allowedRoles.includes(userRole)) {
    // 2. Logged in, but does not have the required role
    // We send them to a "default" page based on their role
    if (userRole === "ADMIN") {
      return <Navigate to="/admin-dashboard" replace />;
    } else if (userRole === "STORE_MANAGER") {
      return <Navigate to="/dashboard" replace />;
    } else {
      return <Navigate to="/user-dashboard" replace />;
    }
  }

  // 3. All checks passed. Show the component.
  return children;
};

export default ProtectedRoute;