import React, { useState, useEffect } from 'react';
import {
  collection, getDocs, doc, updateDoc, deleteDoc, addDoc
} from 'firebase/firestore';
import { db, auth, storage } from './Firebaseconfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';

interface User {
  id?: string;
  name: string;
  age: number;
}

const FormData = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [newName, setNewName] = useState('');
  const [newAge, setNewAge] = useState('');
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [user, setUser] = useState<FirebaseUser | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) navigate('/');
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, 'users'));
      const usersArray = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as User[];
      setUsers(usersArray);
    };
    fetchUsers();
  }, []);

  const updateUser = async (userId: string | undefined, updatedData: Partial<User>) => {
    if (!userId) return;
    const userDoc = doc(db, 'users', userId);
    await updateDoc(userDoc, updatedData);
    setUsers(users.map(u => (u.id === userId ? { ...u, ...updatedData } : u)));
  };

  const deleteUser = async (userId: string | undefined) => {
    if (!userId) return;
    await deleteDoc(doc(db, 'users', userId));
    setUsers(users.filter(u => u.id !== userId));
  };

  const handleAddGame = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert('You must be logged in.');
      return;
    }

    if (!title.trim() || !genre.trim()) {
      alert('Title and genre required.');
      return;
    }

    try {
      let imageUrl = 'https://variety.com/wp-content/uploads/2024/01/featured_videogame_SR_v3.jpg?w=910&h=511&crop=1'; // Default image

      if (imageFile) {
        const imageRef = ref(storage, `gameImages/${Date.now()}_${imageFile.name}`);
        const snapshot = await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      await addDoc(collection(db, 'games'), {
        title: title.trim(),
        genre: genre.trim(),
        imageUrl,
        userId: user.uid,
      });

      alert('Game added!');
      setTitle('');
      setGenre('');
      setImageFile(null);
      navigate('/formdata');
    } catch (error) {
      console.error('Error adding game:', error);
      alert('Failed to add game.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <form onSubmit={handleAddGame} style={{ marginBottom: '40px' }}>
        <h2>Add New Game</h2>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="form-control mb-2"
        />
        <input
          type="text"
          placeholder="Genre"
          value={genre}
          onChange={e => setGenre(e.target.value)}
          className="form-control mb-2"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          className="form-control mb-3"
        />
        <button type="submit" className="btn btn-primary">Add Game</button>
      </form>

      {users.map(user => (
        <div key={user.id} style={{ border: '2px solid black', margin: '10px 0', padding: '10px' }}>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Age:</strong> {user.age}</p>

          <input
            type="text"
            placeholder="New name"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            className="form-control mb-2"
          />
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => user.id && newName && updateUser(user.id, { name: newName.trim() })}
          >
            Update Name
          </button>

          <input
            type="number"
            placeholder="New age"
            value={newAge}
            onChange={e => setNewAge(e.target.value)}
            className="form-control my-2"
          />
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => user.id && newAge && updateUser(user.id, { age: Number(newAge) })}
          >
            Update Age
          </button>

          <button
            className="btn btn-sm btn-danger mt-2"
            onClick={() => user.id && deleteUser(user.id)}
          >
            Delete User
          </button>
        </div>
      ))}
    </div>
  );
};

export default FormData;