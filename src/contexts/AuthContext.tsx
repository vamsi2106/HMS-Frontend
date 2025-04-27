import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import api from '../lib/axios';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/auth/me')
        .then(response => setUser(response.data))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    console.log("repsonse", response);
    localStorage.setItem('token', response.data.access_token);
    const userResponse = await api.get('auth/me');
    setUser(userResponse.data);
  };

  // const login = async (email: string, password: string) => {
  //   const response = await api.post('/auth/login', { email, password });
  //   localStorage.setItem('token', response.data.access_token);
  //   console.log(response.data.user)
  //   setUser(response.data.user); // ✅ Use user data from login response
  // };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};