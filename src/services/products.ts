
import { api } from './api';
import { Product } from '../types';

export const getProducts = (
  page = 1, 
  limit = 10,
  sort?: string,
  filter?: Record<string, string>
) => {
  let queryParams = `?limit=${limit}&page=${page}`;
  
  if (sort) {
    queryParams += `&sort=${sort}`;
  }
  
  if (filter) {
    Object.entries(filter).forEach(([key, value]) => {
      if (value) {
        queryParams += `&filter[${key}]=${value}`;
      }
    });
  }
  
  return api.get<{ code: number; data: Product[] }>(`/products${queryParams}`);
};

export const getProduct = (id: number) => {
  return api.get<{ code: number; data: Product }>(`/products/${id}`);
};

export const createProduct = (productData: {
  name: string;
  price: number;
  category_id: number;
  description?: string;
  image?: File;
}) => {
  return api.post<{ code: number; data: Product }>('/products', productData, true);
};

export const updateProduct = (
  id: number,
  productData: Partial<{
    name: string;
    price: number;
    category_id: number;
    description: string;
    image: File;
  }>
) => {
  return api.put<{ code: number; data: Product }>(`/products/${id}`, productData, true);
};

export const deleteProduct = (id: number) => {
  return api.delete<{ code: number; data: null }>(`/products/${id}`);
};
