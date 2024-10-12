import axios from 'axios';

export const login = async (data: { data: { email: string, password: string } }) => {
  try {
    const response = await axios.post(`${process.env.NEXT_BACKEND_URL}/userapi/loginuser`, { data });
    const { token, user } = response.data;

    // Store the token (in localStorage or cookies)
    localStorage.setItem('token', token);

    return { user, token };
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};