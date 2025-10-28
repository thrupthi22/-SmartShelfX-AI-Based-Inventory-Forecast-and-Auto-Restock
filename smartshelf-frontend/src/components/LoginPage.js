// In src/components/LoginPage.js

// In src/components/LoginPage.js

import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from 'axios';

// --- NEW MUI IMPORTS ---
import {
  Button,
  CssBaseline,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Container
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Avatar from '@mui/material/Avatar';
// --- END NEW IMPORTS ---

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

      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');

    } catch (err) {
      console.error("Login error:", err);
      if (err.response) {
        setError(err.response.data.message || err.response.data);
      } else if (err.request) {
        setError("Cannot connect to server. Is your backend running?");
      } else {
        setError(`An unexpected error occurred: ${err.message}`);
      }
    }
  };

  return (
    // Container component centers our content
    <Container component="main" maxWidth="xs">
      <CssBaseline /> {/* Adds a standard, clean baseline style */}
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          border: '1px solid #e0e0e0',
          padding: 4,
          borderRadius: 2,
          boxShadow: '0 3px 5px 0 rgba(0,0,0,0.1)'
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Login to SmartShelf
        </Typography>

        {/* Our form, now using Box and noValidate */}
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
            variant="contained" // This gives it the "professional" filled-in look
            sx={{ mt: 3, mb: 2 }} // Adds margin top/bottom
          >
            Sign In
          </Button>

          <Grid container>
            <Grid item xs>
              {/* Use MUI's Link, but tell it to act like a React Router Link */}
              <Link component={RouterLink} to="/forgot-password" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link component={RouterLink} to="/register" variant="body2">
                {"Need an account? Register Here"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default LoginPage;