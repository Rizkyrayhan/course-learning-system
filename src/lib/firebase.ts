
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported as isAnalyticsSupported } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCCTQJvAyOXqP9Nk-8NBCC7QMcNPnOJ6hE",
  authDomain: "aplication-sentosa-flora.firebaseapp.com",
  databaseURL: "https://aplication-sentosa-flora-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "aplication-sentosa-flora",
  storageBucket: "aplication-sentosa-flora.firebasestorage.app",
  messagingSenderId: "618138027109",
  appId: "1:618138027109:web:2254d95f899222e7c8f28c",
  measurementId: "G-G3QKES1J05"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

// Initialize Firebase Analytics if supported
let analytics;
if (typeof window !== 'undefined') {
  isAnalyticsSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, auth, db, analytics };
