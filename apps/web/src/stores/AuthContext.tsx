import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '../api/client';
import { UserDTO } from '@sihflow/types';

interface AuthContextType {
  user: UserDTO | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: UserDTO) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLead: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserDTO | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('sihflow_token'));
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadCurrentUser() {
      if (token) {
        try {
          const res = await apiClient.get('/auth/me');
          if (res.data && res.data.success) {
            setUser(res.data.data);
          }
        } catch (error) {
          console.warn('Session expired or invalid token');
          logout();
        }
      } else {
        // Provide mock default active user (Team Lead) for seamless preview
        setUser({
          id: 'usr-lead-001',
          name: 'Member 1',
          email: 'lead@sihflow.io',
          role: 'TEAM_LEAD',
          teamRole: 'Team Lead',
          githubUsername: 'member1-lead',
          responsibilities: 'Architecture, Integration, Dashboard, Review, Deployment, Live Demo',
        });
      }
      setLoading(false);
    }

    loadCurrentUser();
  }, [token]);

  const login = (newToken: string, newUser: UserDTO) => {
    localStorage.setItem('sihflow_token', newToken);
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('sihflow_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
        isLead: user?.role === 'TEAM_LEAD' || (user?.role as any) === 'ADMIN',
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
