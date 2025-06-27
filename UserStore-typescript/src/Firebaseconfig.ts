// Firebaseconfig.ts

import { initializeApp } from "firebase/app";
import {
  getAnalytics,
  isSupported as isAnalyticsSupported
} from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCU3OWaXhdx4qM8USVx2ORJkLWxnksLdUY",
  authDomain: "test-b0c1c.firebaseapp.com",
  projectId: "test-b0c1c",
  storageBucket: "test-b0c1c.appspot.com",
  messagingSenderId: "695865009549",
  appId: "1:695865009549:web:e65a3513b25a608e4c09c4",
  measurementId: "G-7DRGJ1SB1W"
};

// ✅ Initialize Firebase App
const app = initializeApp(firebaseConfig);

// ✅ Optional: Initialize Analytics (only if supported)
let analytics;
isAnalyticsSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  }
});

// ✅ Initialize and export Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };