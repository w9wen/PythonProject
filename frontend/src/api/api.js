import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws';

// Configure axios
axios.defaults.baseURL = API_URL;

// Add token to requests if it exists
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// API services
export const api = {
  // Auth
  login: (email, password) => {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);
    return axios.post('/auth/login', formData);
  },
  
  // Users
  getCurrentUser: () => axios.get('/users/me'),
  registerUser: (userData) => axios.post('/users/', userData),
  updateUser: (userData) => axios.put('/users/me', userData),
  
  // Items
  getItems: (page = 1, limit = 10) => axios.get(`/items/?skip=${(page-1)*limit}&limit=${limit}`),
  getItem: (id) => axios.get(`/items/${id}`),
  createItem: (itemData) => axios.post('/items/', itemData),
  updateItem: (id, itemData) => axios.put(`/items/${id}`, itemData),
  deleteItem: (id) => axios.delete(`/items/${id}`),
  
  // AI
  generateAIResponse: (prompt, maxTokens = 100) => 
    axios.post('/ai/generate', { prompt, max_tokens: maxTokens }),
  
  generateLangchainResponse: (prompt, maxTokens = 100) => 
    axios.post('/ai/langchain', { prompt, max_tokens: maxTokens }),
};

// WebSocket connection
export const createWebSocketConnection = (token) => {
  return new WebSocket(`${WS_URL}/${token}`);
};

export default api;
