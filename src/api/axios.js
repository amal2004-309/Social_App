import axios from 'axios';

export const API_BASE_URL = 'https://route-posts.routemisr.com';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to attach authentication token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.token = token;
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Helper to extract clean error message from API response
export function getApiErrorMessage(error) {
  if (error.response?.data) {
    const { message, errors, error: oldError } = error.response.data;
    if (message) return message;
    if (Array.isArray(errors)) return errors.join(', ');
    if (typeof errors === 'string') return errors;
    if (oldError) return oldError;
  }
  return error.message || 'Something went wrong. Please try again.';
}

export default api;
