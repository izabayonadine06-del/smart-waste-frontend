import axios from 'axios';

const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');

  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const getUserReports = async (userId) => {
  const response = await axios.get(
    `${API_URL}/waste/user/${userId}`,
    {
      headers: getAuthHeader(),
    }
  );

  return response.data;
};

export const getAllReports = async () => {
  const response = await axios.get(
    `${API_URL}/waste`,
    {
      headers: getAuthHeader(),
    }
  );

  return response.data;
};

export const createReport = async (reportData) => {
  const response = await axios.post(
    `${API_URL}/waste`,
    reportData,
    {
      headers: getAuthHeader(),
    }
  );

  return response.data;
};

export const getReportById = async (id) => {
  const response = await axios.get(
    `${API_URL}/waste/${id}`,
    {
      headers: getAuthHeader(),
    }
  );

  return response.data;
};

export const updateReportStatus = async (id, status) => {
  const response = await axios.put(
    `${API_URL}/waste/${id}/status`,
    { status },
    {
      headers: getAuthHeader(),
    }
  );

  return response.data;
};

export const deleteReport = async (id) => {
  const response = await axios.delete(
    `${API_URL}/waste/${id}`,
    {
      headers: getAuthHeader(),
    }
  );

  return response.data;
};

const wasteService = {
  getUserReports,
  getAllReports,
  createReport,
  getReportById,
  updateReportStatus,
  deleteReport,
};

export default wasteService;