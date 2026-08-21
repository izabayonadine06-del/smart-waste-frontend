import axios from 'axios';

const API_URL =
  import.meta.env.VITE_API_URL ||
  'https://backend-smart-wast-3.onrender.com/api';

const register = async (userData) => {
  try {
    console.log('REGISTER DATA:', userData);

    const response = await axios.post(
      `${API_URL}/auth/register`,
      userData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      'REGISTER ERROR:',
      error.response?.data || error.message
    );

    throw new Error(
      error.response?.data?.message ||
      error.response?.data?.error ||
      'Registration failed'
    );
  }
};

export default {
  register,
};