import axios from 'axios';

let baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Strip any trailing slashes first
baseURL = baseURL.replace(/\/+$/, '');

// Ensure baseURL ends with /api if it doesn't already
if (!baseURL.endsWith('/api') && !baseURL.includes('localhost')) {
  baseURL = `${baseURL}/api`;
}

const api = axios.create({
  baseURL,
});

// Add a request interceptor to add the JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
