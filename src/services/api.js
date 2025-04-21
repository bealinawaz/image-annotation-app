// lib/api.js
import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://my-json-server.typicode.com/MostafaKMilly/demo';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

export const categoriesApi = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

export const imagesApi = {
  getAll: () => api.get('/images'),
  getById: (id) => api.get(`/images/${id}`),
  create: (data) => api.post('/images', data),
  update: (id, data) => api.put(`/images/${id}`, data),
  delete: (id) => api.delete(`/images/${id}`),
};

export const annotationsApi = {
  getAll: () => api.get('/annotations'),
  getByImageId: (imageId) => api.get(`/images/${imageId}/annotations/`),
  create: (data) => api.post('/annotations', data),
  update: (id, data) => api.put(`/annotations/${id}`, data),
  delete: (id) => api.delete(`/annotations/${id}`),
};

export default api;
