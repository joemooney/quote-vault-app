"use client";

import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

// Store singleton instances
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let googleProvider: GoogleAuthProvider | null = null;

// These are required for Firebase to work.
const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
];

// This function will only be called on the client side.
export function getFirebaseInstances() {
  let isConfigured = false;
  let missingKeys: string[] = [];
  let availableKeys: string[] = [];
  
  // This code only runs in the browser.
  if (typeof window !== 'undefined') {
    // Get all available NEXT_PUBLIC_ keys for debugging purposes
    availableKeys = Object.keys(process.env).filter(key => key.startsWith('NEXT_PUBLIC_'));
    
    missingKeys = requiredEnvVars.filter(key => {
      const value = process.env[key];
      return !value || value.trim() === '';
    });

    isConfigured = missingKeys.length === 0;

    if (isConfigured && !app) {
       const firebaseConfig = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      };
      
      app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
      auth = getAuth(app);
      db = getFirestore(app);
      googleProvider = new GoogleAuthProvider();
    }
  }

  return { app, auth, db, googleProvider, isConfigured, missingKeys, availableKeys };
}
