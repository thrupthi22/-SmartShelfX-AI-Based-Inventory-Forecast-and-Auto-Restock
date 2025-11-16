import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';

import {
  Box, Button, Container, CssBaseline, TextField, Typography, Paper, Alert
} from '@mui/material';

function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (newPassword.length < 6) {
        setError("New password must be at least 6 characters long.");
        return;
    }

    try {
      // NOTE: We use standard axios and the specific endpoint name
      const response = await axios.post('http://localhost:8080/api/auth/reset-password-direct', {
          email,
          oldPassword,
          newPassword
      });

      setMessage(response.data);
      // Clear fields on success
      setOldPassword('');
      setNewPassword('');

    } catch (err) {
      console.error("Password reset error:", err);
      if (err.response) {
        setError(err.response.data);
      } else if (err.request) {
        setError("Cannot connect to server. Please check if the backend is running.");
      } else {
        setError(`An unexpected error occurred: ${err.message}`);
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Paper elevation={6} sx={{ mt: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: 3 }}>
        <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Change Password
        </Typography>
        <Typography component="p" variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
          Verify your current password to set a new one.
        </Typography>

        {message && <Alert severity="success" sx={{ width: '100%', mb: 2 }}>{message}</Alert>}
        {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleResetSubmit} sx={{ width: '100%', mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="old-password"
            label="Current/Old Password"
            type="password"
            id="old-password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="new-password"
            label="New Password (min 6 characters)"
            type="password"
            id="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, py: 1.5 }}
          >
            Update Password
          </Button>

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <RouterLink to="/login" style={{ textDecoration: 'none' }}>
              <Button color="primary" size="small">
                Back to Login
              </Button>
            </RouterLink>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default ResetPasswordPage;