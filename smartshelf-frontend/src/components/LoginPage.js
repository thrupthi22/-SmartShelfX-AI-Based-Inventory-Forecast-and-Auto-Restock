import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from 'axios';

// --- MUI IMPORTS ---
import {
  Button,
  CssBaseline,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Container,
  Avatar,
  Paper
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
// --- END IMPORTS ---

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        email: email,
        password: password
      });

      // 1. Get BOTH token and role from the response
      const token = response.data.token;
      const role = response.data.role;

      // 2. Save BOTH to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);

      // 3. Role-based redirect logic
      if (role === "ADMIN") {
          navigate('/admin-dashboard');
      } else if (role === "STORE_MANAGER") {
          navigate('/dashboard'); // Manager's dashboard
      } else { // USER role
          navigate('/user-dashboard');
      }

    } catch (err) {
      console.error("Login error:", err);
      if (err.response) {
        // Use response.data if it's a string, or response.data.message if it's an object
        setError(err.response.data.message || err.response.data || "Invalid credentials");
      } else if (err.request) {
        setError("Cannot connect to server. Is your backend running?");
      } else {
        setError(`An unexpected error occurred: ${err.message}`);
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Paper
        elevation={6}
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 4,
          borderRadius: 3,
          boxShadow: '0 8px 16px 0 rgba(0,0,0,0.1)'
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold' }}>
          Login to SmartShelf
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
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
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <Typography color="error" variant="body2" align="center" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, py: 1.5 }}
          >
            Sign In
          </Button>

          <Grid container>
            <Grid item xs>
              {/* --- FORGOT PASSWORD LINK --- */}
              <Link component={RouterLink} to="/forgot-password" variant="body2" sx={{ color: 'primary.main', fontWeight: 'medium' }}>
                Change Password
              </Link>
            </Grid>
            <Grid item>
              <Link component={RouterLink} to="/register" variant="body2">
                {"Need an account? Register Here"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}

export default LoginPage;