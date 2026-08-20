import api from './api';

// Payment Service - Handle payment operations
export const paymentService = {
  // Get all payments
  getAllPayments: async (filters = {}) => {
    try {
      const response = await api.get('/api/payments', { params: filters });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch payments');
    }
  },

  // Get payment by ID
  getPaymentById: async (paymentId) => {
    try {
      const response = await api.get(`/api/payments/${paymentId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch payment');
    }
  },

  // Create payment
  createPayment: async (paymentData) => {
    try {
      const response = await api.post('/api/payments', paymentData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create payment');
    }
  },

  // Process payment
  processPayment: async (paymentId, paymentDetails) => {
    try {
      const response = await api.post(`/api/payments/${paymentId}/process`, paymentDetails);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Payment processing failed');
    }
  },

  // Update payment status
  updateStatus: async (paymentId, status) => {
    try {
      const response = await api.patch(`/api/payments/${paymentId}/status`, { status });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update payment status');
    }
  },

  // Get payments by user
  getUserPayments: async (userId) => {
    try {
      const response = await api.get(`/api/payments/user/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user payments');
    }
  },

  // Get payments by collection
  getCollectionPayments: async (collectionId) => {
    try {
      const response = await api.get(`/api/payments/collection/${collectionId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch collection payments');
    }
  },

  // Get payments by status
  getPaymentsByStatus: async (status) => {
    try {
      const response = await api.get(`/api/payments?status=${status}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch payments');
    }
  },

  // Refund payment
  refundPayment: async (paymentId, reason) => {
    try {
      const response = await api.post(`/api/payments/${paymentId}/refund`, { reason });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Refund failed');
    }
  },

  // Get payment methods
  getPaymentMethods: async () => {
    try {
      const response = await api.get('/api/payment-methods');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch payment methods');
    }
  },

  // Get payment statistics
  getPaymentStats: async (startDate, endDate) => {
    try {
      const response = await api.get('/api/payments/stats', {
        params: { startDate, endDate },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch payment stats');
    }
  },

  // Verify payment
  verifyPayment: async (transactionId) => {
    try {
      const response = await api.get(`/api/payments/verify/${transactionId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Payment verification failed');
    }
  },

  // Delete payment
  deletePayment: async (paymentId) => {
    try {
      const response = await api.delete(`/api/payments/${paymentId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete payment');
    }
  },
};

export default paymentService;
