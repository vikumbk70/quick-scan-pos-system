
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, OrderItem } from '../types';
import { toast } from 'sonner';

interface CartContextType {
  items: OrderItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<OrderItem[]>([]);
  
  // Try to load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setItems(parsedCart);
      } catch (e) {
        console.error('Error loading cart from localStorage', e);
      }
    }
  }, []);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = (product: Product, quantity = 1) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find(item => item.product_id === product.id);
      
      if (existingItem) {
        toast.success(`Updated quantity of ${product.name}`);
        return prevItems.map(item => 
          item.product_id === product.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      toast.success(`Added ${product.name} to cart`);
      return [...prevItems, { 
        product_id: product.id, 
        quantity,
        price: product.price,
        product
      }];
    });
  };

  const removeItem = (productId: number) => {
    setItems((prevItems) => {
      const itemToRemove = prevItems.find(item => item.product_id === productId);
      if (itemToRemove?.product) {
        toast.info(`Removed ${itemToRemove.product.name} from cart`);
      }
      return prevItems.filter(item => item.product_id !== productId);
    });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    
    setItems((prevItems) => 
      prevItems.map(item => 
        item.product_id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    toast.info('Cart cleared');
  };

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  
  const totalAmount = items.reduce((total, item) => {
    const price = item.price || item.product?.price || 0;
    return total + (price * item.quantity);
  }, 0);

  const value = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    totalAmount
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
