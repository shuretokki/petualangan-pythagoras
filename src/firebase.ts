import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "petualanganpythagoras.firebaseapp.com",
  projectId: "petualanganpythagoras",
  storageBucket: "petualanganpythagoras.firebasestorage.app",
  messagingSenderId: "298577748752",
  appId: "1:298577748752:web:c70cc01a3c745113c4bb95",
  measurementId: "G-97H9Q655LQ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);