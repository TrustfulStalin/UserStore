import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface Game {
  id: string;
  title: string;
  genre: string;
  rating: number;
  price: number;
  imageUrl?: string;
}

interface CartContextType {
  cart: Game[];
  addToCart: (game: Game) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};

// Props type for CartProvider
interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<Game[]>([]);

  const addToCart = (game: Game) => {
    setCart((prev) => [...prev, game]);
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((g) => g.id !== id));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

