import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
];

// This object will be populated on the client side only.
const firebaseInstances = {
  app: null as FirebaseApp | null,
  auth: null as Auth | null,
  db: null as Firestore | null,
  googleProvider: null as GoogleAuthProvider | null,
  isConfigured: false,
  missingKeys: [] as string[],
  availableKeys: [] as string[],
};

// This initialization logic will only run once on the client.
if (typeof window !== 'undefined') {
    firebaseInstances.availableKeys = Object.keys(process.env).filter(key => key.startsWith('NEXT_PUBLIC_'));
    
    firebaseInstances.missingKeys = requiredEnvVars.filter(key => {
      const value = process.env[key as keyof typeof process.env];
      return !value || value.trim() === '';
    });

    firebaseInstances.isConfigured = firebaseInstances.missingKeys.length === 0;

    if (firebaseInstances.isConfigured) {
       const firebaseConfig = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      };
      
      const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
      firebaseInstances.app = app;
      firebaseInstances.auth = getAuth(app);
      firebaseInstances.db = getFirestore(app);
      firebaseInstances.googleProvider = new GoogleAuthProvider();
    }
}

/**
* Gets the client-side Firebase instances.
* This function's return value is memoized and will be the same on every call.
*/
export function getFirebaseInstances() {
    return firebaseInstances;
}
