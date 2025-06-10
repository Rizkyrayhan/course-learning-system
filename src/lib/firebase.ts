// TODO: Replace with your actual Firebase configuration
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";

const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "YOUR_API_KEY";
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID";
const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "YOUR_APP_ID";

if (apiKey === "YOUR_API_KEY" || !apiKey) {
  throw new Error(
    "Firebase API Key is not configured. " +
    "Please set the NEXT_PUBLIC_FIREBASE_API_KEY environment variable " +
    "or update the placeholder value in src/lib/firebase.ts with your actual Firebase project's API Key. " +
    "You can find these details in your Firebase project settings on the Firebase console."
  );
}

if (projectId === "YOUR_PROJECT_ID" || !projectId) {
  throw new Error(
    "Firebase Project ID is not configured. " +
    "Please set the NEXT_PUBLIC_FIREBASE_PROJECT_ID environment variable " +
    "or update the placeholder value in src/lib/firebase.ts with your actual Firebase project's Project ID. " +
    "You can find these details in your Firebase project settings on the Firebase console."
  );
}

if (appId === "YOUR_APP_ID" || !appId) {
  throw new Error(
    "Firebase App ID is not configured. " +
    "Please set the NEXT_PUBLIC_FIREBASE_APP_ID environment variable " +
    "or update the placeholder value in src/lib/firebase.ts with your actual Firebase project's App ID. " +
    "You can find these details in your Firebase project settings on the Firebase console."
  );
}

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: apiKey,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "YOUR_AUTH_DOMAIN",
  projectId: projectId,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "YOUR_STORAGE_BUCKET",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "YOUR_MESSAGING_SENDER_ID",
  appId: appId,
  // measurementId: "YOUR_MEASUREMENT_ID" // Optional
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
// const analytics = getAnalytics(app); // Optional

export { app, auth, db };
