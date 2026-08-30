import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { apiClient } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  switchRole: (email: string) => Promise<void>;
  logout: () => void;
  isTeamLead: boolean;
  isReviewer: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('sihflow_token'));
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('sihflow_token');
      if (storedToken) {
        try {
          const userData = await apiClient.getMe();
          setUser(userData);
        } catch (e) {
          console.error('Session expired, auto-logging in as Team Lead...');
          await autoLoginDefault();
        }
      } else {
        await autoLoginDefault();
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const autoLoginDefault = async () => {
    try {
      const data = await apiClient.login('lead@sihflow.io', 'Demo@123');
      localStorage.setItem('sihflow_token', data.token);
      setToken(data.token);
      setUser(data.user);
    } catch (e) {
      console.error('Failed to auto-login default lead:', e);
    }
  };

  const login = async (email: string, password = 'Demo@123') => {
    const data = await apiClient.login(email, password);
    localStorage.setItem('sihflow_token', data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const switchRole = async (email: string) => {
    setLoading(true);
    try {
      await login(email, 'Demo@123');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('sihflow_token');
    setToken(null);
    setUser(null);
  };

  const isTeamLead = user?.role === 'TEAM_LEAD';
  const isReviewer = user?.role === 'REVIEWER' || isTeamLead;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        switchRole,
        logout,
        isTeamLead,
        isReviewer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
