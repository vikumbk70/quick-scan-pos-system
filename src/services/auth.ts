
import { api } from './api';
import { AuthResponse, User } from '../types';

export const login = (username: string, password: string) => {
  return api.post<{ status: number; data: AuthResponse }>('/login', { username, password });
};

export const register = (userData: {
  username: string;
  password: string;
  email: string;
  name: string;
  image?: File;
  role_id: number;
}) => {
  return api.post<{ status: number; data: User }>('/register', userData, true);
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) as User : null;
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
