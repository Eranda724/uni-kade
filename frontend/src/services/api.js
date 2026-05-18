import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Add token to requests if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getShopProducts = async (shopId) => {
  const response = await API.get(`/products/shop/${shopId}`);
  return response.data;
};

export const getUserById = async (userId) => {
  const response = await API.get(`/users/${userId}`);
  return response.data;
};

export default API;