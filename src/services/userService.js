import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeader = () => {
  const token = localStorage.getItem('token');

  return {
    Authorization: `Bearer ${token}`,
  };
};

/* Get all users */
export const getAllUsers = async () => {
  const response = await axios.get(
    `${API_URL}/users`,
    {
      headers: getAuthHeader(),
    }
  );

  return response.data;
};

/* Get user */
export const getUserById = async (id) => {
  const response = await axios.get(
    `${API_URL}/users/${id}`,
    {
      headers: getAuthHeader(),
    }
  );

  return response.data;
};

/* Create user */
export const createUser = async (
  userData
) => {
  const response = await axios.post(
    `${API_URL}/users/admin`,
    userData,
    {
      headers: {
        ...getAuthHeader(),
        'Content-Type':
          'application/json',
      },
    }
  );

  return response.data;
};

/* Update user */
export const updateUser = async (
  id,
  userData
) => {
  const response = await axios.put(
    `${API_URL}/users/${id}`,
    userData,
    {
      headers: {
        ...getAuthHeader(),
        'Content-Type':
          'application/json',
      },
    }
  );

  return response.data;
};

/* Delete user */
export const deleteUser = async (
  id
) => {
  const response = await axios.delete(
    `${API_URL}/users/${id}/soft`,
    {
      headers: getAuthHeader(),
    }
  );

  return response.data;
};

/* Restore */
export const restoreUser = async (
  id
) => {
  const response = await axios.put(
    `${API_URL}/users/${id}/restore`,
    {},
    {
      headers: getAuthHeader(),
    }
  );

  return response.data;
};

/* Drivers */
export const getDrivers = async () => {
  const response = await axios.get(
    `${API_URL}/users/drivers`,
    {
      headers: getAuthHeader(),
    }
  );

  return response.data;
};

/* Deleted users */
export const getDeletedUsers =
  async () => {
    const response = await axios.get(
      `${API_URL}/users/deleted`,
      {
        headers: getAuthHeader(),
      }
    );

    return response.data;
  };