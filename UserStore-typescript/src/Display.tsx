import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  collection, getDocs, doc, updateDoc, deleteDoc
} from 'firebase/firestore';
import { db, auth } from './Firebaseconfig'; // Make sure auth is imported here

interface Game {
  id: string;
  title: string;
  genre: string;
  rating: number;
  price: number;
  imageUrl?: string;
}

interface Order {
  id: string;
  date: string;
  name: string;
  email: string;
  items: Game[];
  total: number;
}

const DisplayData = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [filteredGenre, setFilteredGenre] = useState<string>('All');
  const [cart, setCart] = useState<Game[]>([]);
  const [orderHistory, setOrderHistory] = useState<Order[]>(() => {
    const stored = localStorage.getItem('orderHistory');
    return stored ? JSON.parse(stored) : [];
  });

  const [newTitle, setNewTitle] = useState('');
  const [newGenre, setNewGenre] = useState('');
  const [newRating, setNewRating] = useState('');
  const [newPrice, setNewPrice] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchGames = async () => {
      const querySnapshot = await getDocs(collection(db, 'games'));
      const gameArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Game[];
      setGames(gameArray);
    };
    fetchGames();
  }, []);

  const updateGame = async (gameId: string, updatedData: Partial<Game>) => {
    const gameDoc = doc(db, 'games', gameId);
    await updateDoc(gameDoc, updatedData);
  };

  const deleteGame = async (gameId: string) => {
    await deleteDoc(doc(db, 'games', gameId));
    setGames(games.filter((game) => game.id !== gameId));
  };

  const addToCart = (game: Game) => {
    setCart((prevCart) => [...prevCart, game]);
    alert(`${game.title} added to cart.`);
  };

  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((g) => g.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalAmount = cart.reduce((acc, game) => acc + game.price, 0);

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty.');
      return;
    }

    const user = auth.currentUser;
    const userName = user?.displayName || 'No Name';
    const userEmail = user?.email || 'No Email';

    // Generate Order ID and date
    const orderId = Math.random().toString(36).substr(2, 9).toUpperCase();
    const now = new Date();
    const formattedDate = now.toLocaleString();

    const receipt = `
RECEIPT
-----------------------
Order ID: ${orderId}
Date: ${formattedDate}

Name: ${userName}
Email: ${userEmail}

Items Purchased:
${cart.map((game) => `- ${game.title}: $${game.price.toFixed(2)}`).join('\n')}

-----------------------
Total: $${totalAmount.toFixed(2)}

Thank you for your purchase!
`;

    alert(receipt);

    // Create order object
    const newOrder: Order = {
      id: orderId,
      date: formattedDate,
      name: userName,
      email: userEmail,
      items: cart,
      total: totalAmount,
    };

    // Update order history state and localStorage
    const updatedHistory = [newOrder, ...orderHistory];
    setOrderHistory(updatedHistory);
    localStorage.setItem('orderHistory', JSON.stringify(updatedHistory));

    clearCart();
  };

  // Delete a specific order from history
  const deleteOrder = (orderId: string) => {
    const updatedHistory = orderHistory.filter(order => order.id !== orderId);
    setOrderHistory(updatedHistory);
    localStorage.setItem('orderHistory', JSON.stringify(updatedHistory));
  };

  const uniqueGenres = ['All', ...Array.from(new Set(games.map((g) => g.genre)))];
  const filteredGames =
    filteredGenre === 'All' ? games : games.filter((g) => g.genre === filteredGenre);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Game List</h2>

      {/* Genre Filter */}
      <div className="mb-4 d-flex justify-content-center">
        <select
          className="form-select w-auto"
          value={filteredGenre}
          onChange={(e) => setFilteredGenre(e.target.value)}
        >
          {uniqueGenres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
      </div>

      {/* Game Cards */}
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {filteredGames.map((game) => (
          <div className="col" key={game.id}>
            <div className="card h-100 shadow-sm">
              {game.imageUrl && (
                <img
                  src={game.imageUrl}
                  alt={game.title}
                  className="card-img-top"
                  style={{ objectFit: 'cover', height: 200, width: '100%' }}
                />
              )}
              <div className="card-body">
                <h5 className="card-title">{game.title}</h5>
                <p className="card-text">Genre: {game.genre}</p>
                <p className="card-text">Rating: {game.rating}</p>
                <p className="card-text">Price: ${game.price?.toFixed(2)}</p>

                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="New title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
                <button
                  className="btn btn-outline-primary btn-sm mb-2"
                  onClick={() => {
                    updateGame(game.id, { title: newTitle });
                    setNewTitle('');
                  }}
                >
                  Update Title
                </button>

                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="New genre"
                  value={newGenre}
                  onChange={(e) => setNewGenre(e.target.value)}
                />
                <button
                  className="btn btn-outline-secondary btn-sm mb-2"
                  onClick={() => {
                    updateGame(game.id, { genre: newGenre });
                    setNewGenre('');
                  }}
                >
                  Update Genre
                </button>

                <input
                  type="number"
                  className="form-control mb-2"
                  placeholder="New rating"
                  value={newRating}
                  onChange={(e) => setNewRating(e.target.value)}
                />
                <button
                  className="btn btn-outline-warning btn-sm mb-2"
                  onClick={() => {
                    updateGame(game.id, { rating: Number(newRating) });
                    setNewRating('');
                  }}
                >
                  Update Rating
                </button>

                <input
                  type="number"
                  className="form-control mb-2"
                  placeholder="New price"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                />
                <button
                  className="btn btn-outline-success btn-sm mb-2"
                  onClick={() => {
                    updateGame(game.id, { price: Number(newPrice) });
                    setNewPrice('');
                  }}
                >
                  Update Price
                </button>

                <button
                  className="btn btn-info btn-sm w-100 mb-2"
                  onClick={() => addToCart(game)}
                >
                  Add to Cart
                </button>

                <button
                  className="btn btn-danger btn-sm w-100"
                  onClick={() => deleteGame(game.id)}
                >
                  Delete Game
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Section */}
      <div className="mt-5">
        <h3>Cart</h3>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <ul className="list-group mb-3">
              {cart.map((game) => (
                <li key={game.id} className="list-group-item d-flex justify-content-between align-items-center">
                  {game.title} - ${game.price.toFixed(2)}
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => removeFromCart(game.id)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <h5>Total: ${totalAmount.toFixed(2)}</h5>
            <button
              className="btn btn-success mt-3"
              onClick={handleCheckout}
            >
              Checkout
            </button>
          </>
        )}
      </div>

      {/* Order History Section */}
      <div className="mt-5">
        <h3>Order History</h3>
        {orderHistory.length === 0 ? (
          <p>No past orders.</p>
        ) : (
          <ul className="list-group">
            {orderHistory.map((order) => (
              <li key={order.id} className="list-group-item d-flex justify-content-between align-items-start">
                <div>
                  <strong>Order ID:</strong> {order.id} <br />
                  <strong>Date:</strong> {order.date} <br />
                  <strong>Name:</strong> {order.name} <br />
                  <strong>Email:</strong> {order.email} <br />
                  <strong>Items:</strong>
                  <ul>
                    {order.items.map((game) => (
                      <li key={game.id}>
                        {game.title} - ${game.price.toFixed(2)}
                      </li>
                    ))}
                  </ul>
                  <strong>Total:</strong> ${order.total.toFixed(2)}
                </div>
                <button
                  className="btn btn-danger btn-sm ms-3"
                  onClick={() => deleteOrder(order.id)}
                  title="Delete order"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Back Button */}
      <div className="text-center mt-5">
        <button
          className="btn btn-secondary"
          onClick={() => navigate('/add')}
        >
          ← Back to Form
        </button>
      </div>
    </div>
  );
};

export default DisplayData;