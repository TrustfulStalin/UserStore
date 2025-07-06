import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DisplayData from '../Display';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;



// ✅ Mock Firebase
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  getDocs: jest.fn(() => ({
    docs: [
      {
        id: '1',
        data: () => ({
          title: 'Test Game',
          genre: 'Action',
          rating: 4,
          price: 19.99,
          imageUrl: '',
        }),
      },
    ],
  })),
  doc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
}));

// ✅ Mock Firebase Auth
jest.mock('../Firebaseconfig', () => ({
  db: {},
  auth: {
    currentUser: {
      displayName: 'Test User',
      email: 'test@example.com',
    },
  },
}));

// ✅ Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// ✅ Utility to render with router
const renderWithRouter = (ui: React.ReactElement) =>
  render(<BrowserRouter>{ui}</BrowserRouter>);

describe('DisplayData Component', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    window.alert = jest.fn(); // mock alert
  });

  test('renders and displays game from Firestore', async () => {
    renderWithRouter(<DisplayData />);
    expect(await screen.findByText('Test Game')).toBeInTheDocument();
    expect(screen.getByText(/Genre: Action/)).toBeInTheDocument();
    expect(screen.getByText(/Price: \$19.99/)).toBeInTheDocument();
  });

  test('adds item to cart and updates total', async () => {
    renderWithRouter(<DisplayData />);
    fireEvent.click(await screen.findByText('Add to Cart'));
    expect(window.alert).toHaveBeenCalledWith('Test Game added to cart.');
    expect(await screen.findByText('Total: $19.99')).toBeInTheDocument();
  });

  test('shows cart and completes checkout', async () => {
    renderWithRouter(<DisplayData />);
    fireEvent.click(await screen.findByText('Add to Cart'));
    fireEvent.click(screen.getByText('Checkout'));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('RECEIPT'));
    });

    expect(screen.queryByText('Test Game - $19.99')).not.toBeInTheDocument(); // Cart should clear
  });

  test('navigates back when clicking Back to Form', async () => {
    renderWithRouter(<DisplayData />);
    fireEvent.click(screen.getByText('← Back to Form'));
    expect(mockNavigate).toHaveBeenCalledWith('/add');
  });
});