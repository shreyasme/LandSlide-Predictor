import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (email, password) => api.post('/auth/login', { email, password }),
  logout: () => localStorage.removeItem('token'),
};

export const predictionAPI = {
  predict: (data) => api.post('/predict', data),
  getHistory: () => api.get('/history'),
  getStats: () => api.get('/stats'),
};

export const adminAPI = {
  getAllPredictions: () => api.get('/admin/predictions'),
  getSystemStats: () => api.get('/admin/stats'),
  uploadDataset: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/admin/upload-dataset', formData);
  },
  retrainModel: () => api.post('/admin/retrain-model'),
};

export default api;
