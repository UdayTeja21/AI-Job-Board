import axios from 'axios';

let baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
// Ensure baseURL always ends with /api if the user forgot it in their environment variable
if (baseURL && !baseURL.endsWith('/api') && !baseURL.includes('localhost')) {
  baseURL = `${baseURL.replace(/\/$/, '')}/api`;
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
