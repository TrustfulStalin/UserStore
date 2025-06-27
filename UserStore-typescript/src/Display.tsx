import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  collection, getDocs, doc, updateDoc, deleteDoc
} from 'firebase/firestore';
import { db } from './Firebaseconfig';

interface Game {
  id: string;
  title: string;
  genre: string;
  rating: number;
  imageUrl?: string;
}

const DisplayData = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [filteredGenre, setFilteredGenre] = useState<string>('All');

  const [newTitle, setNewTitle] = useState('');
  const [newGenre, setNewGenre] = useState('');
  const [newRating, setNewRating] = useState('');

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
                  style={{ objectFit: 'cover', height: '200px', width: '100%' }}
                />
              )}
              <div className="card-body">
                <h5 className="card-title">{game.title}</h5>
                <p className="card-text">Genre: {game.genre}</p>
                <p className="card-text">Rating: {game.rating}</p>

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
                  className="btn btn-outline-warning btn-sm mb-3"
                  onClick={() => {
                    updateGame(game.id, { rating: Number(newRating) });
                    setNewRating('');
                  }}
                >
                  Update Rating
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