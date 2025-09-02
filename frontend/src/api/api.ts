import axios, { AxiosResponse } from 'axios';
import { 
  User, 
  Item, 
  LoginResponse, 
  AIResponse, 
  ItemFormData 
} from '../types';

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
  login: (email: string, password: string): Promise<AxiosResponse<LoginResponse>> => {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);
    return axios.post('/auth/login', formData);
  },
  
  // Users
  getCurrentUser: (): Promise<AxiosResponse<User>> => 
    axios.get('/users/me'),
  
  registerUser: (userData: { username: string; email: string; password: string }): Promise<AxiosResponse<User>> => 
    axios.post('/users/', userData),
  
  updateUser: (userData: Partial<User>): Promise<AxiosResponse<User>> => 
    axios.put('/users/me', userData),
  
  // Items
  getItems: (page = 1, limit = 10): Promise<AxiosResponse<Item[]>> => 
    axios.get(`/items/?skip=${(page-1)*limit}&limit=${limit}`),
  
  getItem: (id: number): Promise<AxiosResponse<Item>> => 
    axios.get(`/items/${id}`),
  
  createItem: (itemData: ItemFormData): Promise<AxiosResponse<Item>> => 
    axios.post('/items/', itemData),
  
  updateItem: (id: number, itemData: Partial<ItemFormData>): Promise<AxiosResponse<Item>> => 
    axios.put(`/items/${id}`, itemData),
  
  deleteItem: (id: number): Promise<AxiosResponse<void>> => 
    axios.delete(`/items/${id}`),
  
  // AI
  generateAIResponse: (prompt: string, maxTokens = 100): Promise<AxiosResponse<AIResponse>> => 
    axios.post('/ai/generate', { prompt, max_tokens: maxTokens }),
  
  generateLangchainResponse: (prompt: string, maxTokens = 100): Promise<AxiosResponse<AIResponse>> => 
    axios.post('/ai/langchain', { prompt, max_tokens: maxTokens }),
};

// WebSocket connection
export const createWebSocketConnection = (token: string): WebSocket => {
  return new WebSocket(`${WS_URL}/${token}`);
};

export default api;
