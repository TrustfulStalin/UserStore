import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import AddGameForm from './Addform';
import DisplayData from './Display';
import Login from './Login';
import Register from './Registar';
import { CartProvider } from './Cart'; // Adjust the path if needed
import CartPage from './CartPage';

const App = () => {
  return (
    <CartProvider>
      <>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">GameStore</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Register</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/add">Add Game</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/formdata">Display Games</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/cart">Cart</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/add" element={<AddGameForm />} />
            <Route path="/formdata" element={<DisplayData />} />
            <Route path="/cart" element={<CartPage />} />
          
          </Routes>
        </div>
      </>
    </CartProvider>
  );
};

export default App;