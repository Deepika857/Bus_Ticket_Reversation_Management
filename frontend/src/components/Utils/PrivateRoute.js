import React from 'react';
import { Navigate } from 'react-router-dom';

const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp;
    return !exp || Date.now() > exp * 1000;
  } catch {
    return true;
  }
};

const getUserRole = () => {
  const token = localStorage.getItem('jwtToken');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role;
  } catch {
    return null;
  }
};

const PrivateRoute = ({ children, roles = [] }) => {
  const token = localStorage.getItem('jwtToken');

  if (!token || isTokenExpired(token)) {
    localStorage.removeItem('jwtToken');
    return <Navigate to="/login" />;
  }

  const role = getUserRole();
  if (roles.length && !roles.includes(role)) return <Navigate to="/login" />;

  return children;
};

export default PrivateRoute;
