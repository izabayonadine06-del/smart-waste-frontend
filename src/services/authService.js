import axios from 'axios';

const API_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000/api';

const authService = {

  register: async (userData) => {
    try {
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
        'Registration API error:',
        error.response?.data || error.message
      );

      throw error;
    }
  },

};

export default authService;