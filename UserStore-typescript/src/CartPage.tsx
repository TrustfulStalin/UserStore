import React from 'react';
import { useCart } from './Cart';

const CartPage = () => {
  const { cart, removeFromCart, clearCart } = useCart();

  const total = cart.reduce((sum, game) => sum + game.price, 0);

  if (cart.length === 0) {
    return <h3 className="text-center">Your cart is empty</h3>;
  }

  return (
    <div className="container">
      <h2 className="mb-4 text-center">Your Cart</h2>
      <ul className="list-group mb-3">
        {cart.map((game) => (
          <li className="list-group-item d-flex justify-content-between align-items-center" key={game.id}>
            <div>
              <h5>{game.title}</h5>
              <p className="mb-0">${game.price.toFixed(2)}</p>
            </div>
            <button className="btn btn-sm btn-danger" onClick={() => removeFromCart(game.id)}>Remove</button>
          </li>
        ))}
      </ul>
      <div className="text-end">
        <h4>Total: ${total.toFixed(2)}</h4>
        <button className="btn btn-warning mt-2" onClick={clearCart}>Clear Cart</button>
      </div>
    </div>
  );
};

export default CartPage;