import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to all requests
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Log in development
  if (import.meta.env.DEV) {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
  }

  return config;
});

// Add response interceptor for logging (development only)
if (import.meta.env.DEV) {
  apiClient.interceptors.response.use(
    (response) => {
      console.log(`[API] Response:`, response.data);
      return response;
    },
    (error) => {
      console.error(`[API] Error:`, error.response?.data || error.message);
      return Promise.reject(error);
    }
  );
}
