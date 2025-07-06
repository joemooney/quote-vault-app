"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { getFirebaseInstances } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  isConfigured: boolean;
  missingKeys: string[];
  availableKeys: string[];
  isClient: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [missingKeys, setMissingKeys] = useState<string[]>([]);
  const [availableKeys, setAvailableKeys] = useState<string[]>([]);

  useEffect(() => {
    setIsClient(true);
    
    const instances = getFirebaseInstances();
    
    setIsConfigured(instances.isConfigured);
    setMissingKeys(instances.missingKeys);
    setAvailableKeys(instances.availableKeys);

    if (instances.isConfigured && instances.auth) {
      const unsubscribe = onAuthStateChanged(instances.auth, (user) => {
        setUser(user);
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  const signInWithGoogle = async () => {
    if (!isConfigured) {
      alert("Firebase is not configured. Please add your project credentials to the .env.local file to enable authentication.");
      return;
    }
    const { auth, googleProvider } = getFirebaseInstances();

    if (!auth || !googleProvider) {
      console.error("Firebase auth instances not available during sign-in.");
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
    const { auth } = getFirebaseInstances();
    if (!auth) {
        console.error("Firebase auth instance not available during sign-out.");
        return;
    }
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  const value = { user, loading, signInWithGoogle, signOut, isConfigured, missingKeys, availableKeys, isClient };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
