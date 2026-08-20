import api from './api';

// Notification Service - Handle notifications and feedback
export const notificationService = {
  // Get all notifications
  getAllNotifications: async (filters = {}) => {
    try {
      const response = await api.get('/notifications', { params: filters });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get user notifications
  getUserNotifications: async (userId) => {
    try {
      const response = await api.get(`/notifications/user/${userId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get unread notifications
  getUnreadNotifications: async (userId) => {
    try {
      const response = await api.get(`/notifications/user/${userId}/unread`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    try {
      const response = await api.patch(`/notifications/${notificationId}/read`, {});
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Mark all notifications as read
  markAllAsRead: async (userId) => {
    try {
      const response = await api.patch(`/notifications/user/${userId}/read-all`, {});
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Delete notification
  deleteNotification: async (notificationId) => {
    try {
      const response = await api.delete(`/notifications/${notificationId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Send notification (admin only)
  sendNotification: async (notificationData) => {
    try {
      const response = await api.post('/notifications', notificationData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get notification by ID
  getNotificationById: async (notificationId) => {
    try {
      const response = await api.get(`/notifications/${notificationId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

// Feedback Service - Handle feedback and complaints
export const feedbackService = {
  // Get all feedback
  getAllFeedback: async (filters = {}) => {
    try {
      const response = await api.get('/feedback', { params: filters });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get feedback by ID
  getFeedbackById: async (feedbackId) => {
    try {
      const response = await api.get(`/feedback/${feedbackId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Create feedback/review
  createFeedback: async (feedbackData) => {
    try {
      const response = await api.post('/feedback', feedbackData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Submit complaint
  submitComplaint: async (complaintData) => {
    try {
      const response = await api.post('/feedback/complaint', complaintData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update feedback
  updateFeedback: async (feedbackId, feedbackData) => {
    try {
      const response = await api.put(`/feedback/${feedbackId}`, feedbackData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update feedback status
  updateStatus: async (feedbackId, status) => {
    try {
      const response = await api.patch(`/feedback/${feedbackId}/status`, { status });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Add admin response
  addResponse: async (feedbackId, response) => {
    try {
      const responseObj = await api.post(`/feedback/${feedbackId}/response`, { response });
      return responseObj;
    } catch (error) {
      throw error;
    }
  },

  // Get user feedback
  getUserFeedback: async (userId) => {
    try {
      const response = await api.get(`/feedback/user/${userId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get complaints
  getComplaints: async (filters = {}) => {
    try {
      const response = await api.get('/feedback?isComplaint=true', { params: filters });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get feedback by collection
  getCollectionFeedback: async (collectionId) => {
    try {
      const response = await api.get(`/feedback/collection/${collectionId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Delete feedback
  deleteFeedback: async (feedbackId) => {
    try {
      const response = await api.delete(`/feedback/${feedbackId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get feedback statistics
  getFeedbackStats: async () => {
    try {
      const response = await api.get('/feedback/stats');
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default notificationService;
