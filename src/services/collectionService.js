import api from './api';

// Collection Service - Handle waste collection operations
const collectionService = {
  // Get all collections
  getAllCollections: async (filters = {}) => {
    try {
      const response = await api.get('/collections', { params: filters });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get collection by ID
  getCollectionById: async (collectionId) => {
    try {
      const response = await api.get(`/collections/${collectionId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Create new collection (assign waste to driver)
  createCollection: async (collectionData) => {
    try {
      const response = await api.post('/collections', collectionData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update collection
  updateCollection: async (collectionId, collectionData) => {
    try {
      const response = await api.put(`/collections/${collectionId}`, collectionData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update collection status
  updateStatus: async (collectionId, status) => {
    try {
      const response = await api.patch(`/collections/${collectionId}/status`, { status });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get collections assigned to a driver
  getDriverCollections: async (driverId) => {
    try {
      const response = await api.get(`/collections/driver/${driverId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get collections for a citizen
  getCitizenCollections: async (userId) => {
    try {
      const response = await api.get(`/collections/citizen/${userId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Assign collection to driver
  assignToDriver: async (collectionId, driverId) => {
    try {
      const response = await api.post(`/collections/${collectionId}/assign`, { driverId });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Mark collection as completed
  completeCollection: async (collectionId, completionData) => {
    try {
      const response = await api.post(`/collections/${collectionId}/complete`, completionData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get collections by status
  getCollectionsByStatus: async (status) => {
    try {
      const response = await api.get(`/collections?status=${status}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get pending collections
  getPendingCollections: async () => {
    try {
      const response = await api.get('/collections?status=pending');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get completed collections
  getCompletedCollections: async () => {
    try {
      const response = await api.get('/collections?status=completed');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Delete collection
  deleteCollection: async (collectionId) => {
    try {
      const response = await api.delete(`/collections/${collectionId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default collectionService;
