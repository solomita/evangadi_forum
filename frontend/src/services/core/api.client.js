import axios from 'axios';

/**
 * Configured axios instance for API communication.
 */
const apiClient = axios.create({
  // In production (e.g. Vercel multi-service), frontend and backend share one
  // origin, so an empty baseURL makes calls relative ("/api/...") and they route
  // to the backend automatically. VITE_API_BASE_URL still overrides if set.
  baseURL:
    import.meta.env.VITE_API_BASE_URL ??
    (import.meta.env.PROD ? '' : 'http://localhost:5004'),
  timeout: 300000,
  headers: {
  },
});

/**
 * Request interceptor to attach the JWT token to headers.
 */
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

/**
 * Response interceptor to handle global 401 unauthorized errors.
 */
apiClient.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // Skip global 401 redirect for auth endpoints so components can handle login/register errors
    const isAuthEndpoint =
      error.config?.url?.includes('/api/auth/login') ||
      error.config?.url?.includes('/api/auth/register');

    if (error.response?.status === 401 && !isAuthEndpoint) {
      // Clear authentication data
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Redirect to login page
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  },
);

export { apiClient };