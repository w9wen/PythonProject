// Type definitions for our application

// User types
export interface User {
  id: number;
  email: string;
  username: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Auth context types
export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  fetchUserProfile: () => Promise<User | null>;
}

// Item types
export interface Item {
  id: number;
  title: string;
  description: string;
  owner_id: number;
  created_at: string;
  updated_at: string;
}

// API response types
export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface AIResponse {
  text: string;
}

// Message types for WebSocket
export interface ChatMessage {
  message: string;
  sender: string;
  timestamp?: string;
}

// Form types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ItemFormData {
  title: string;
  description: string;
}

export interface AIRequestData {
  prompt: string;
  max_tokens?: number;
}
