import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

// --- THEME IMPORTS ---
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { ThemeContext } from './ThemeContext';
import { lightTheme, darkTheme } from './theme';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// --- COMPONENT IMPORTS ---
import RegisterPage from './components/RegisterPage';
import LoginPage from './components/LoginPage';
import DashboardPage from './components/DashboardPage';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import SalesReportsPage from './components/SalesReportsPage';
import AdminUsersPage from './components/AdminUsersPage';
import ForecastPage from './components/ForecastPage';
import RestockRequestsPage from './components/RestockRequestsPage';
import ResetPasswordPage from './components/ResetPasswordPage';
import AnalyticsPage from './components/AnalyticsPage';
import SupplierManagementPage from './components/SupplierManagementPage'; // <<< NEW IMPORT ADDED >>>

function App() {
  // --- Theme State ---
  const [mode, setMode] = useState('light');

  const themeContextValue = useMemo(
    () => ({
      themeMode: mode,
      toggleTheme: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [mode]
  );

  const theme = useMemo(
    () => (mode === 'light' ? lightTheme : darkTheme),
    [mode]
  );

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <CssBaseline />
          <Router>
            <Routes>
              {/* --- Public Routes --- */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ResetPasswordPage />} />

              {/* --- Protected Routes --- */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['STORE_MANAGER', 'ADMIN']}>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin-dashboard"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin-users"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminUsersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/forecast"
                element={
                  <ProtectedRoute allowedRoles={['STORE_MANAGER', 'ADMIN']}>
                    <ForecastPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/restock-requests"
                element={
                  <ProtectedRoute allowedRoles={['STORE_MANAGER', 'ADMIN']}>
                    <RestockRequestsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analytics"
                element={
                  <ProtectedRoute allowedRoles={['STORE_MANAGER', 'ADMIN']}>
                    <AnalyticsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/suppliers" // <<< SUPPLIER MANAGEMENT ROUTE ADDED >>>
                element={
                  <ProtectedRoute allowedRoles={['STORE_MANAGER', 'ADMIN']}>
                    <SupplierManagementPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/user-dashboard"
                element={
                  <ProtectedRoute allowedRoles={['USER', 'STORE_MANAGER', 'ADMIN']}>
                    <UserDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/sales-report"
                element={
                  <ProtectedRoute allowedRoles={['STORE_MANAGER', 'ADMIN']}>
                    <SalesReportsPage />
                  </ProtectedRoute>
                }
              />

              {/* --- Default Route --- */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </Router>
        </LocalizationProvider>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export default App;