import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

// Student API
export const studentAPI = {
  getProfile: () => api.get('/students/profile'),
  updateProfile: (data) => api.put('/students/profile', data),
};

// Materials API
export const materialsAPI = {
  upload: (formData) => api.post('/materials/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getAll: () => api.get('/materials'),
  getById: (id) => api.get(`/materials/${id}`),
};

// Subjects API
export const subjectsAPI = {
  getAll: () => api.get('/subjects'),
  create: (data) => api.post('/subjects', data),
};

// Chapters API
export const chaptersAPI = {
  getBySubject: (subjectId) => api.get(`/chapters/subject/${subjectId}`),
  getById: (chapterId) => api.get(`/chapters/${chapterId}`),
  create: (data) => api.post('/chapters', data),
};

// Study API
export const studyAPI = {
  generateNotes: (data) => api.post('/study/notes', data),
  generateFlashcards: (data) => api.post('/study/flashcards', data),
  getSessions: (limit) => api.get(`/study/sessions?limit=${limit || 50}`),
  updateSession: (sessionId, data) => api.put(`/study/sessions/${sessionId}`, data),
};

// Quiz API
export const quizAPI = {
  generate: (data) => api.post('/quiz/generate', data),
  submit: (data) => api.post('/quiz/submit', data),
  getAttempts: (limit) => api.get(`/quiz/attempts?limit=${limit || 50}`),
};

// Tests API
export const testsAPI = {
  generate: (data) => api.post('/tests/generate', data),
  submit: (data) => api.post('/tests/submit', data),
  getAll: (limit) => api.get(`/tests?limit=${limit || 50}`),
};

// Progress API
export const progressAPI = {
  getSummary: () => api.get('/progress/summary'),
  getRevision: () => api.get('/progress/revision'),
  getAccuracy: (days) => api.get(`/progress/accuracy?days=${days || 30}`),
  getTime: (days) => api.get(`/progress/time?days=${days || 30}`),
  getTopics: () => api.get('/progress/topics'),
};

// Planner API
export const plannerAPI = {
  generate: () => api.post('/planner/generate'),
  getToday: () => api.get('/planner/today'),
};

export default api;

