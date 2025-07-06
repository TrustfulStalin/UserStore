import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { CartProvider, useCart } from '../Cart'; // update path

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <CartProvider>{children}</CartProvider>
);

const sampleGame = {
  id: '1',
  title: 'Test Game',
  genre: 'Action',
  rating: 4.5,
  price: 29.99,
};

describe('CartContext', () => {
  test('adds a game to the cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(sampleGame);
    });

    expect(result.current.cart).toHaveLength(1);
    expect(result.current.cart[0]).toEqual(sampleGame);
  });

  test('removes a game from the cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(sampleGame);
      result.current.removeFromCart(sampleGame.id);
    });

    expect(result.current.cart).toHaveLength(0);
  });

  test('clears the cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(sampleGame);
      result.current.addToCart({ ...sampleGame, id: '2' });
      result.current.clearCart();
    });

    expect(result.current.cart).toHaveLength(0);
  });
});