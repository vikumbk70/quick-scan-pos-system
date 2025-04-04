
import { toast } from 'sonner';

const BASE_URL = 'https://api.example.com'; // Replace with your actual API URL

interface ApiOptions {
  method: string;
  headers?: Record<string, string>;
  body?: FormData | string;
}

export interface ApiResponse<T> {
  code?: number;
  status?: number;
  data: T;
}

export async function apiRequest<T>(
  endpoint: string, 
  options: ApiOptions
): Promise<ApiResponse<T>> {
  try {
    const token = localStorage.getItem('token');
    
    const headers: Record<string, string> = {
      ...options.headers,
    };
    
    if (token) {
      headers['Authorization'] = token;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    toast.error(error instanceof Error ? error.message : 'Request failed');
    throw error;
  }
}

export const api = {
  get: <T>(endpoint: string) => {
    return apiRequest<T>(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
  },
  post: <T>(endpoint: string, data: any, isFormData = false) => {
    let body: string | FormData;
    const headers: Record<string, string> = {};
    
    if (isFormData) {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value as string | Blob);
      });
      body = formData;
    } else {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(data);
    }
    
    return apiRequest<T>(endpoint, {
      method: 'POST',
      headers,
      body
    });
  },
  put: <T>(endpoint: string, data: any, isFormData = false) => {
    let body: string | FormData;
    const headers: Record<string, string> = {};
    
    if (isFormData) {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, value as string | Blob);
        }
      });
      body = formData;
    } else {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(data);
    }
    
    return apiRequest<T>(endpoint, {
      method: 'PUT',
      headers,
      body
    });
  },
  delete: <T>(endpoint: string) => {
    return apiRequest<T>(endpoint, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });
  }
};
