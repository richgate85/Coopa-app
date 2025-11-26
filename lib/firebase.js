// Import the functions you need from the SDKs
import { initializeApp, getApps, getApp } from "firebase/app";
// We have removed getAnalytics for now to fix the "window" error
import { getAuth } from "firebase/auth"; // The Club Bouncer
import { getFirestore } from "firebase/firestore"; // The Magic Notebook

// Your web app's Firebase configuration — prefer environment variables.
// These should be set in a `.env.local` file for development, e.g.
// NEXT_PUBLIC_FIREBASE_API_KEY=...
// NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
// etc. See README_FIREBASE_ENV.md for details.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCX4MP6lDJgrH3osS6y5xwnwTpVwW-mA-8",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "coopa-wpa2.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "coopa-wpa2",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "coopa-wpa2.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "567972595787",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:567972595787:web:150ddfa404f79be03b25ce",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-R4E6KMWEQ7",
};

// Initialize Firebase (avoid double initialization during HMR)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize and export the tools you want to use in other files
// Firestore can be used on server and client
export const db = getFirestore(app);

// Auth is a browser/client API. Don't call getAuth on the server to avoid
// "window is not defined" errors during SSR. Provide a safe getter.
export function getAuthClient() {
  if (typeof window === "undefined") {
    // Caller is running on the server — return null to indicate auth isn't available
    return null;
  }
  return getAuth(app);
}

// Provide a convenience `auth` export that is null on the server and the
// client auth object in the browser. This keeps existing imports that expect
// `auth` working while still being server-safe.
export const auth = (typeof window === "undefined") ? null : getAuth(app);

// We will add analytics back later!