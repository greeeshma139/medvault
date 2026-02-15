import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
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

// User API
export const userAPI = {
  register: (data) => api.post('/users/register', data),
  login: (data) => api.post('/users/login', data),
  getCurrentUser: () => api.get('/users/me'),
  updateProfile: (data) => api.put('/users/profile', data),
  verifyEmail: (token) => api.get(`/users/verify-email/${token}`),
};

// Patient API
export const patientAPI = {
  getProfile: () => api.get('/patients/profile'),
  updateProfile: (data) => api.put('/patients/profile', data),
  addPreferredDoctor: (data) => api.post('/patients/add-preferred-doctor', data),
};

// Professional API
export const professionalAPI = {
  getAll: (params) => api.get('/professionals', { params }),
  getById: (id) => api.get(`/professionals/${id}`),
  getProfile: () => api.get('/professionals/profile'),
  updateProfile: (data) => api.put('/professionals/profile', data),
};

export default api;
