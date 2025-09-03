import api from './api';

export const login = (credentials) => {
  return api.post('/Auth/Login', credentials);
};

export const register = (data) => {
  return api.post('/Auth/Register', data);
};

export const logout = () => {
  localStorage.removeItem('bus-app-token');
};

export const isLoggedIn = () => {
  return !!localStorage.getItem('bus-app-token');
};
