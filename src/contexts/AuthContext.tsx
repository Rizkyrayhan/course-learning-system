
"use client";

import type { User as FirebaseUser } from 'firebase/auth';
import { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { auth } from '@/lib/firebase'; // Placeholder, ensure this path is correct
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import type { AdminUser, AppUser } from '@/types';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: AppUser | null;
  admin: AdminUser | null;
  loading: boolean;
  isStudent: boolean;
  isAdmin: boolean;
  loginAdmin: (username: string, pass: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let localAdminChecked = false;
    let authStateResolved = false;

    const finalizeLoadingState = () => {
      if (localAdminChecked && authStateResolved) {
        setLoading(false);
      }
    };

    // Check for persisted admin session from localStorage
    const storedAdminUser = localStorage.getItem('adminUser');
    if (storedAdminUser) {
      try {
        setAdmin(JSON.parse(storedAdminUser));
      } catch (e) {
        console.error("Failed to parse admin user from localStorage", e);
        localStorage.removeItem('adminUser'); 
        setAdmin(null); 
      }
    } else {
      setAdmin(null);
    }
    localAdminChecked = true;
    finalizeLoadingState();

    // Listen for Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (!firebaseUser) {
        // If Firebase user logs out, and no admin user is currently in localStorage,
        // then truly no user is logged in.
        const currentStoredAdmin = localStorage.getItem('adminUser');
        if (!currentStoredAdmin) {
          setAdmin(null);
        }
      }
      authStateResolved = true;
      finalizeLoadingState();
    });

    return () => unsubscribe();
  }, []);

  const loginAdmin = useCallback(async (usernameInput: string, passInput: string): Promise<boolean> => {
    setLoading(true);
    if (usernameInput === 'Admin' && passInput === 'admin123') {
      const adminData = { username: 'Admin' };
      setAdmin(adminData);
      localStorage.setItem('adminUser', JSON.stringify(adminData));
      setUser(null); 
      await firebaseSignOut(auth).catch(console.error); 
      setLoading(false);
      return true;
    }
    setLoading(false);
    return false;
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    if (admin) {
      setAdmin(null);
      localStorage.removeItem('adminUser');
    }
    if (user) {
      await firebaseSignOut(auth);
      setUser(null);
    }
    setLoading(false);
    router.push('/');
  }, [admin, user, router]);
  
  const isStudent = !!user && !admin;
  const isAdminUser = !!admin;


  return (
    <AuthContext.Provider value={{ user, admin, loading, loginAdmin, logout, isStudent, isAdmin: isAdminUser }}>
      {children}
    </AuthContext.Provider>
  );
};
