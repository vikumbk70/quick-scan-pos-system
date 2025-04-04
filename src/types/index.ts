
export interface User {
  id: number;
  username: string;
  name: string;
  email?: string;
  image?: string;
  role_id: number;
}

export interface AuthResponse {
  token: string;
  id: number;
  role_id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  category_id: number;
  description?: string;
  image?: string;
  created_at: string;
  updated_at: string;
  stock?: number;
}

export interface Category {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  product_id: number;
  quantity: number;
  price?: number;
  product?: Product;
}

export interface Order {
  id?: number;
  reference?: string;
  user_id: number;
  total?: number;
  created_at?: string;
  updated_at?: string;
  orders?: OrderItem[];
  items?: OrderItem[];
}
