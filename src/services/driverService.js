import api from './api';

// Driver Service - Handle driver/waste collector operations
export const driverService = {
  // Get all drivers
  getAllDrivers: async () => {
    try {
      const response = await api.get('/api/drivers');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch drivers');
    }
  },

  // Get driver by ID
  getDriverById: async (driverId) => {
    try {
      const response = await api.get(`/api/drivers/${driverId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch driver');
    }
  },

  // Register new driver
  registerDriver: async (driverData) => {
    try {
      const response = await api.post('/api/drivers/register', driverData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to register driver');
    }
  },

  // Update driver profile
  updateDriver: async (driverId, driverData) => {
    try {
      const response = await api.put(`/api/drivers/${driverId}`, driverData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update driver');
    }
  },

  // Update driver status
  updateStatus: async (driverId, status) => {
    try {
      const response = await api.patch(`/api/drivers/${driverId}/status`, { status });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update driver status');
    }
  },

  // Update driver location
  updateLocation: async (driverId, latitude, longitude) => {
    try {
      const response = await api.patch(`/api/drivers/${driverId}/location`, {
        latitude,
        longitude,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update location');
    }
  },

  // Get available drivers
  getAvailableDrivers: async () => {
    try {
      const response = await api.get('/api/drivers?status=available');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch available drivers');
    }
  },

  // Get driver performance stats
  getDriverStats: async (driverId) => {
    try {
      const response = await api.get(`/api/drivers/${driverId}/stats`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch driver stats');
    }
  },

  // Rate driver
  rateDriver: async (driverId, rating, comment) => {
    try {
      const response = await api.post(`/api/drivers/${driverId}/rate`, {
        rating,
        comment,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to rate driver');
    }
  },

  // Get drivers by company/organization
  getCompanyDrivers: async (companyId) => {
    try {
      const response = await api.get(`/api/drivers?company=${companyId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch company drivers');
    }
  },

  // Verify driver license
  verifyLicense: async (driverId, licenseData) => {
    try {
      const response = await api.post(`/api/drivers/${driverId}/verify-license`, licenseData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to verify license');
    }
  },

  // Get drivers near location
  getDriversNearby: async (latitude, longitude, radiusKm = 5) => {
    try {
      const response = await api.get('/api/drivers/nearby', {
        params: { latitude, longitude, radius: radiusKm },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch nearby drivers');
    }
  },

  // Delete driver
  deleteDriver: async (driverId) => {
    try {
      const response = await api.delete(`/api/drivers/${driverId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete driver');
    }
  },
};

export default driverService;
