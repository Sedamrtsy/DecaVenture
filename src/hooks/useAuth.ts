'use client';

import { useState, useEffect, useContext, createContext, ReactNode, createElement } from 'react';
import { AuthService, TokenPayload } from '@/lib/auth';
import { MockApiService } from '@/lib/mockApi';
import { UserRole } from '@/types';

interface AuthContextType {
  user: TokenPayload | null;
  loading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<TokenPayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Sayfa yüklendiğinde mevcut kullanıcıyı kontrol et
    const currentUser = AuthService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Mock API'ye login isteği gönder
      const response = await MockApiService.login(email, password, role);

      if (response.success && response.token) {
        AuthService.setToken(response.token);
        const userPayload = AuthService.getCurrentUser();
        setUser(userPayload);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
  };

  const isAuthenticated = user !== null;
  const hasRole = (role: UserRole) => user?.role === role;
  const hasAnyRole = (roles: UserRole[]) => user ? roles.includes(user.role) : false;
  const isAdmin = hasAnyRole(['admin', 'super_admin']);

  const contextValue: AuthContextType = {
    user,
    loading,
    login,
    logout,
    isAuthenticated,
    hasRole,
    hasAnyRole,
    isAdmin,
  };

  return createElement(AuthContext.Provider, { value: contextValue }, children);
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 