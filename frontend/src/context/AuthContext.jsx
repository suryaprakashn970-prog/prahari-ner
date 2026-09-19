import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut as fbSignOut } from 'firebase/auth';
import { auth } from '../services/firebase';

const AuthContext = createContext({
  user: null,
  loading: true,
  isAuthenticated: false,
  logout: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Purge any legacy demo authentication keys from localStorage
    localStorage.removeItem('prahari_demo_session');
    localStorage.removeItem('demo_mode');

    if (!auth) {
      setUser(null);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      },
      (error) => {
        console.error('Firebase onAuthStateChanged error:', error);
        setUser(null);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    if (auth) {
      await fbSignOut(auth);
    }
    setUser(null);
    localStorage.removeItem('prahari_demo_session');
    localStorage.removeItem('demo_mode');
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
