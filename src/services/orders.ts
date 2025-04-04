
import { api } from './api';
import { Order, OrderItem } from '../types';

export const getOrders = () => {
  return api.get<{ code: number; data: Order[] }>('/orders');
};

export const getOrder = (id: number) => {
  return api.get<{ code: number; data: Order }>(`/orders/${id}`);
};

export const getOrderItems = (orderId: number) => {
  return api.get<{ code: number; data: OrderItem[] }>(`/orders/${orderId}/items`);
};

export const createOrder = (orderData: {
  user_id: number;
  orders: OrderItem[];
}) => {
  return api.post<{ code: number; data: Order }>('/orders', orderData);
};

export const deleteOrder = (id: number) => {
  return api.delete<{ code: number; data: null }>(`/orders/${id}`);
};
