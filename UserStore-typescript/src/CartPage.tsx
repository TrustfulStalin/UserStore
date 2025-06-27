import React, { useState, useEffect } from 'react';
import { useCart } from './Cart';

interface Game {
  id: string;
  title: string;
  genre?: string;
  rating?: number;
  price: number;
  imageUrl?: string;
}

interface Order {
  id: string;
  date: string; // ISO string
  items: Game[];
  total: number;
}

const CartPage = () => {
  const { cart, removeFromCart, clearCart } = useCart();
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);

  const total = cart.reduce((sum, game) => sum + game.price, 0);

  // Load order history from localStorage on mount
  useEffect(() => {
    const storedOrders = localStorage.getItem('orderHistory');
    if (storedOrders) {
      setOrderHistory(JSON.parse(storedOrders));
    }
  }, []);

  // Save order history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
  }, [orderHistory]);

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty.');
      return;
    }
    const orderId = Math.random().toString(36).substr(2, 9).toUpperCase();
    const date = new Date().toISOString();

    const newOrder: Order = {
      id: orderId,
      date,
      items: cart,
      total,
    };

    setOrderHistory((prev) => [newOrder, ...prev]); // add new order at the start
    clearCart();
    alert(`Order ${orderId} placed successfully!`);
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4 text-center">Your Cart</h2>
      {cart.length === 0 ? (
        <p className="text-center">Your cart is empty.</p>
      ) : (
        <>
          <ul className="list-group mb-3">
            {cart.map((game) => (
              <li
                className="list-group-item d-flex justify-content-between align-items-center"
                key={game.id}
              >
                <div>
                  <h5>{game.title}</h5>
                  <p className="mb-0">${game.price.toFixed(2)}</p>
                </div>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => removeFromCart(game.id)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <div className="text-end">
            <h4>Total: ${total.toFixed(2)}</h4>
            <button className="btn btn-success mt-3" onClick={handleCheckout}>
              Checkout
            </button>
            <button
              className="btn btn-warning mt-2 ms-2"
              onClick={clearCart}
            >
              Clear Cart
            </button>
          </div>
        </>
      )}

      <hr className="my-5" />

      <h3 className="mb-4 text-center">Order History</h3>
      {orderHistory.length === 0 ? (
        <p className="text-center">No past orders found.</p>
      ) : (
        orderHistory.map((order) => (
          <div
            key={order.id}
            className="card mb-3 shadow-sm"
          >
            <div className="card-header d-flex justify-content-between">
              <strong>Order ID: {order.id}</strong>
              <small>{new Date(order.date).toLocaleString()}</small>
            </div>
            <ul className="list-group list-group-flush">
              {order.items.map((item) => (
                <li
                  key={item.id}
                  className="list-group-item d-flex justify-content-between"
                >
                  <span>{item.title}</span>
                  <span>${item.price.toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="card-footer text-end">
              <strong>Total: ${order.total.toFixed(2)}</strong>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default CartPage;