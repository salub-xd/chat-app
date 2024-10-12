import axios from 'axios';

export const register = async (data: { data: { name: string, username: string, email: string, password: string } }) => {
    try {
        const response = await axios.post(`${process.env.NEXT_BACKEND_URL}/userapi/registeruser`, { data });
        const { token, user } = response.data;

        // Store the token (in localStorage or cookies)
        localStorage.setItem('token', token);

        return { user, token };
    } catch (error) {
        console.error('Login failed:', error);
        throw error;
    }
};