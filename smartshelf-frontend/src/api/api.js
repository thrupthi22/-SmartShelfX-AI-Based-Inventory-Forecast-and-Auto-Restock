import axios from 'axios';

// 1. Create a new axios instance with a base URL
const api = axios.create({
  baseURL: 'http://localhost:8080/api', // All requests will go to /api
  timeout: 5000,
});

// --- 2. Request Interceptor (Attaches Token) ---
api.interceptors.request.use(
  (config) => {
    // 3. Get the token from localStorage
    const token = localStorage.getItem('token');

    // 4. If the token exists, add it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config; // Send the request with the new header
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- 5. Response Interceptor (Handles 401/403 Unauthorized/Forbidden) ---
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // If the server returns 401 (Unauthorized) or 403 (Forbidden),
        // it means the token is expired or invalid.
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            console.error("Authentication Error: Token is invalid or expired. Logging out.");
            // Clear credentials and force a logout
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            // This relies on the ProtectedRoute component redirecting,
            // but centralizes the cleanup.
            // If the user is on a protected route, they will be redirected to /login.
        }
        return Promise.reject(error);
    }
);

export default api;