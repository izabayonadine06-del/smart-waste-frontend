import api from './api';

// Analytics Service - Handle dashboard analytics and reporting
export const analyticsService = {
  // Get dashboard overview
  getDashboardOverview: async () => {
    try {
      const response = await api.get('/api/analytics/overview');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch dashboard overview');
    }
  },

  // Get waste statistics
  getWasteStats: async (startDate, endDate) => {
    try {
      const response = await api.get('/api/analytics/waste', {
        params: { startDate, endDate },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch waste statistics');
    }
  },

  // Get collection statistics
  getCollectionStats: async (startDate, endDate) => {
    try {
      const response = await api.get('/api/analytics/collections', {
        params: { startDate, endDate },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch collection statistics');
    }
  },

  // Get user statistics
  getUserStats: async (startDate, endDate) => {
    try {
      const response = await api.get('/api/analytics/users', {
        params: { startDate, endDate },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user statistics');
    }
  },

  // Get driver performance metrics
  getDriverPerformance: async (startDate, endDate) => {
    try {
      const response = await api.get('/api/analytics/drivers', {
        params: { startDate, endDate },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch driver performance');
    }
  },

  // Get revenue statistics
  getRevenueStats: async (startDate, endDate) => {
    try {
      const response = await api.get('/api/analytics/revenue', {
        params: { startDate, endDate },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch revenue statistics');
    }
  },

  // Get waste distribution by category
  getWasteByCategory: async (startDate, endDate) => {
    try {
      const response = await api.get('/api/analytics/waste-by-category', {
        params: { startDate, endDate },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch waste distribution');
    }
  },

  // Get collection completion rate
  getCompletionRate: async (startDate, endDate) => {
    try {
      const response = await api.get('/api/analytics/completion-rate', {
        params: { startDate, endDate },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch completion rate');
    }
  },

  // Get peak waste reporting hours
  getPeakReportingHours: async (startDate, endDate) => {
    try {
      const response = await api.get('/api/analytics/peak-hours', {
        params: { startDate, endDate },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch peak hours data');
    }
  },

  // Get environmental impact metrics
  getEnvironmentalImpact: async (startDate, endDate) => {
    try {
      const response = await api.get('/api/analytics/environmental-impact', {
        params: { startDate, endDate },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch environmental impact');
    }
  },

  // Get customer satisfaction metrics
  getCustomerSatisfaction: async (startDate, endDate) => {
    try {
      const response = await api.get('/api/analytics/satisfaction', {
        params: { startDate, endDate },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch customer satisfaction');
    }
  },

  // Get most active areas
  getMostActiveAreas: async (limit = 10) => {
    try {
      const response = await api.get('/api/analytics/active-areas', {
        params: { limit },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch active areas');
    }
  },

  // Generate custom report
  generateReport: async (reportParams) => {
    try {
      const response = await api.post('/api/analytics/report', reportParams);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to generate report');
    }
  },

  // Get system health metrics
  getSystemHealth: async () => {
    try {
      const response = await api.get('/api/analytics/system-health');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch system health');
    }
  },

  // Get daily statistics
  getDailyStats: async (date) => {
    try {
      const response = await api.get(`/api/analytics/daily/${date}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch daily stats');
    }
  },

  // Get monthly statistics
  getMonthlyStats: async (year, month) => {
    try {
      const response = await api.get(`/api/analytics/monthly/${year}/${month}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch monthly stats');
    }
  },

  // Export analytics data
  exportAnalytics: async (format = 'pdf', startDate, endDate) => {
    try {
      const response = await api.get('/api/analytics/export', {
        params: { format, startDate, endDate },
        responseType: format === 'pdf' ? 'blob' : 'json',
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to export analytics');
    }
  },
};

export default analyticsService;
