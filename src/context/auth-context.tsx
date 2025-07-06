"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  isConfigured: boolean;
  missingKeys: string[];
  isClient: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [missingKeys, setMissingKeys] = useState<string[]>([]);

  useEffect(() => {
    setIsClient(true);
    
    const requiredEnvVars = [
      'NEXT_PUBLIC_FIREBASE_API_KEY',
      'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
      'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    ];
    const missing = requiredEnvVars.filter(key => !process.env[key]);
    
    if (missing.length === 0) {
      setIsConfigured(true);
      setMissingKeys([]);
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      setMissingKeys(missing);
      setIsConfigured(false);
      setLoading(false);
    }
  }, []);

  const signInWithGoogle = async () => {
    if (!isConfigured) {
      alert("Firebase is not configured. Please add your project credentials to the .env file to enable authentication.");
      return;
    }
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error signing in with Google", error);
    }
  };

  const signOut = async () => {
    if (!isConfigured) return;
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  const value = { user, loading, signInWithGoogle, signOut, isConfigured, missingKeys, isClient };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
