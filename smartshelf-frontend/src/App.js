import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegisterPage from './components/RegisterPage';
import LoginPage from './components/LoginPage';
import DashboardPage from './components/DashboardPage'; // <-- 1. IMPORT THIS

function App() {
  return (
    <Router>
      <Routes>
        {/* --- THIS LINE IS NOW UNCOMMENTED --- */}
        <Route path="/login" element={<LoginPage />} />

        <Route path="/register" element={<RegisterPage />} />

        {/* --- 2. THIS IS THE NEW DASHBOARD ROUTE --- */}
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* --- THIS LINE IS ALSO UNCOMMENTED --- */}
        {/* This makes the login page your new homepage */}
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}
export default App;