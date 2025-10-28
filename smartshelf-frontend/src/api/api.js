// In src/api/api.js

import axios from 'axios';

// 1. Create a new axios instance with a base URL
const api = axios.create({
  baseURL: 'http://localhost:8080/api', // All requests will go to /api
});

// 2. Create the "interceptor"
// This function will run before every request is sent
api.interceptors.request.use(
  (config) => {
    // 3. Get the token from localStorage
    const token = localStorage.getItem('token');

    // 4. If the token exists, add it to the Authorization header
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config; // Send the request with the new header
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

export default api;