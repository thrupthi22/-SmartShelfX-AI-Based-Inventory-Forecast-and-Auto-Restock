import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// --- NEW THEME IMPORTS ---
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { ThemeContext } from './ThemeContext';
import { lightTheme, darkTheme } from './theme';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// --- END THEME IMPORTS ---

// --- COMPONENT IMPORTS ---
import RegisterPage from './components/RegisterPage';
import LoginPage from './components/LoginPage';
import DashboardPage from './components/DashboardPage';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import SalesReportsPage from './components/SalesReportsPage';

function App() {
  // --- 1. State to hold the current mode ---
  const [mode, setMode] = useState('light'); // Default to light mode

  // --- 2. Function to toggle the mode ---
  // We use useMemo to ensure this function doesn't get re-created on every render
  const themeContextValue = useMemo(
    () => ({
      toggleTheme: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    []
  );

  // --- 3. Select the correct MUI theme based on the state ---
  const theme = useMemo(
    () => (mode === 'light' ? lightTheme : darkTheme),
    [mode]
  );

  return (
    // --- 4. Provide the theme and the toggle function to the whole app ---
    <ThemeContext.Provider value={themeContextValue}>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <CssBaseline /> {/* Applies the theme's background color */}
          <Router>
            <Routes>
              {/* --- Public Routes --- */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

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
              <Route path="/" element={<LoginPage />} />
            </Routes>
          </Router>
        </LocalizationProvider>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export default App;