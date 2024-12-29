// firebase-config.js
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from '@firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB0i6vs8BbNhQ4nfbZfHEchvo8BWrKJYK4",
  authDomain: "disdat-9d04f.firebaseapp.com",
  projectId: "disdat-9d04f",
  storageBucket: "disdat-9d04f.firebasestorage.app",
  messagingSenderId: "296250250883",
  appId: "1:296250250883:web:9b518ef178b6afe0f52db6",
  measurementId: "G-XY2NCQ5FES"
};


// Initialize Firebase and export services
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);