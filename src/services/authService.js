import api from './api';

const authService = {
  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Register new user
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userType');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await api.get(`/auth/user/${userId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Verify token
  verifyToken: async () => {
    try {
      const response = await api.get('/auth/verify');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update profile
  updateProfile: async (userId, userData) => {
    try {
      const response = await api.put(`/auth/user/${userId}`, userData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Change password
  changePassword: async (userId, passwordData) => {
    try {
      const response = await api.post(`/auth/change-password/${userId}`, passwordData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Request password reset
  requestPasswordReset: async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Reset password
  resetPassword: async (token, newPassword) => {
    try {
      const response = await api.post('/auth/reset-password', { token, newPassword });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Refresh token
  refreshToken: async () => {
    try {
      const response = await api.post('/auth/refresh-token');
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default authService;
