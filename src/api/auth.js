import apiClient from './apiClient';


export const login = async (email, password) => {
    const res = await apiClient.post('/auth/login', { email, password })
    return res.data;
    if (!res) {
        console.error('Login failed:', res.status);
        return null;
    }
};


export const register = async (name, email, password) => {
    try {
        const res = await apiClient.post('/auth/register', { name, email, password });
        return res.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Registration failed' };
    }
};

