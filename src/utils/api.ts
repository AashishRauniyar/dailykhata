import axios from 'axios';
import { Transaction, LoginCredentials, RegisterData, User } from '../types';

// API base URL - works with both Docker and local development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear stored tokens on unauthorized
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('user');
      
      // Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const transactionAPI = {
  // Get all transactions
  getAll: async (): Promise<Transaction[]> => {
    const response = await api.get('/transactions');
    return response.data;
  },

  // Get transactions by date range
  getByDateRange: async (startDate: string, endDate: string): Promise<Transaction[]> => {
    const response = await api.get('/transactions/date-range', {
      params: { startDate, endDate }
    });
    return response.data;
  },

  // Get transaction by ID
  getById: async (id: string): Promise<Transaction> => {
    const response = await api.get(`/transactions/${id}`);
    return response.data;
  },

  // Create new transaction
  create: async (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt' | 'businessType' | 'userId' | 'user'>): Promise<Transaction> => {
    const response = await api.post('/transactions', transaction);
    return response.data;
  },

  // Update transaction
  update: async (id: string, updates: Partial<Transaction>): Promise<Transaction> => {
    const response = await api.put(`/transactions/${id}`, updates);
    return response.data;
  },

  // Delete transaction
  delete: async (id: string): Promise<void> => {
    await api.delete(`/transactions/${id}`);
  },
};

// Authentication API
export const authAPI = {
  // Login
  login: async (credentials: LoginCredentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Register
  register: async (userData: RegisterData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Get profile
  getProfile: async (): Promise<{ user: User }> => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  // Get all users (admin only)
  getAllUsers: async () => {
    const response = await api.get('/auth/users');
    return response.data;
  },

  // Update user status (admin only)
  updateUserStatus: async (userId: string, isActive: boolean) => {
    const response = await api.patch(`/auth/users/${userId}/status`, { isActive });
    return response.data;
  },
};

// Health check
export const healthCheck = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    throw error;
  }
};

export default api; 