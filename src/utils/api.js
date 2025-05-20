import axios from 'axios';
import Cookies from 'js-cookie';
import Router from 'next/router';

const api = axios.create({
  baseURL: 'http://localhost:8085', // match your Quarkus server
});

// Add token to headers
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Redirect to login if 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('token');
      Router.push('/');
    }
    return Promise.reject(error);
  }
);

export default api;