// In src/components/RegisterPage.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

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
import Avatar from '@mui/material/Avatar';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
// --- END NEW IMPORTS ---

function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    contact: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post(
        'http://localhost:8080/api/auth/register',
        formData
      );

      console.log(response.data);
      navigate('/login'); // Redirect to login page after success

    } catch (err) {
      console.error("Registration error:", err);
      if (err.response) {
        setError(err.response.data);
      } else if (err.request) {
        setError("Cannot connect to the server. Is your backend running?");
      } else {
        setError(`An unexpected error occurred: ${err.message}`);
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
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
          <PersonAddAltIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Register New Account
        </Typography>

        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete="name"
                name="fullName"
                required
                fullWidth
                id="fullName"
                label="Full Name"
                autoFocus
                value={formData.fullName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="contact"
                label="Contact (Optional)"
                type="text"
                id="contact"
                value={formData.contact}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          {error && (
            <Typography color="error" variant="body2" align="center" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Register
          </Button>

          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link component={RouterLink} to="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default RegisterPage;