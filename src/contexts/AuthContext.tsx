
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
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (!firebaseUser) { // If firebase user logs out, ensure admin is also logged out unless explicitly handled
        const storedAdmin = localStorage.getItem('adminUser');
        if(!storedAdmin) setAdmin(null); // only clear admin if not found in LS
      }
      setLoading(false);
    });

    // Check for persisted admin session
    const storedAdminUser = localStorage.getItem('adminUser');
    if (storedAdminUser) {
      try {
        setAdmin(JSON.parse(storedAdminUser));
      } catch (e) {
        localStorage.removeItem('adminUser');
      }
    }
    // Ensure loading is false after checking local storage too
    setLoading(false);


    return () => unsubscribe();
  }, []);

  const loginAdmin = useCallback(async (usernameInput: string, passInput: string): Promise<boolean> => {
    setLoading(true);
    // Local admin credentials
    if (usernameInput === 'Admin' && passInput === 'admin123') {
      const adminData = { username: 'Admin' };
      setAdmin(adminData);
      localStorage.setItem('adminUser', JSON.stringify(adminData));
      setUser(null); // Ensure no student user is active
      await firebaseSignOut(auth).catch(console.error); // Sign out any Firebase user
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
