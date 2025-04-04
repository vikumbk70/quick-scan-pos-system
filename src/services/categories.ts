
import { api } from './api';
import { Category } from '../types';

export const getCategories = () => {
  return api.get<{ code: number; data: Category[] }>('/categories');
};

export const getCategory = (id: number) => {
  return api.get<{ code: number; data: Category }>(`/categories/${id}`);
};

export const createCategory = (name: string) => {
  return api.post<{ code: number; data: Category }>('/categories', { name });
};

export const updateCategory = (id: number, name: string) => {
  return api.put<{ code: number; data: Category }>(`/categories/${id}`, { name });
};

export const deleteCategory = (id: number) => {
  return api.delete<{ code: number; data: null }>(`/categories/${id}`);
};
