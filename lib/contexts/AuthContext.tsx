'use client';

/**
 * Authentication Context
 *
 * Context untuk mengelola state autentikasi di seluruh aplikasi.
 * Mengikuti prinsip:
 * - SRP: Hanya handle state management, business logic di hook
 * - OCP: Bisa diperluas tanpa ubah consumer
 * - DIP: Depend on abstraction (API interface), bukan concrete implementation
 */

import React, { createContext, useCallback, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import type { User, UserRole } from '@/types';
import { authAPI } from '@/lib/api';
import { profileAPI } from '@/lib/api';
import { setCookie, removeCookie } from '@/lib/utils/cookies';
import { AuthenticationError } from '@/lib/utils/errors';

// ============================================
// Types
// ============================================

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateNama: (nama: string) => Promise<void>;
  updatePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

interface JWTPayload {
  id: number;
  email: string;
  nama: string;
  role: UserRole;
  iat: number;
  exp: number;
}

// ============================================
// Context
// ============================================

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================
// Constants
// ============================================

const TOKEN_KEY = 'auth_token';
const TOKEN_COOKIE_NAME = 'auth_token';
const TOKEN_MAX_AGE = 15 * 60; // 15 menit

// ============================================
// Provider Component
// ============================================

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Decode JWT token untuk extract user info
   */
  const decodeToken = useCallback((token: string): User | null => {
    try {
      const decoded = jwtDecode<JWTPayload>(token);

      // Check if token expired
      const now = Math.floor(Date.now() / 1000);
      if (decoded.exp < now) {
        return null;
      }

      return {
        id: decoded.id,
        nama: decoded.nama,
        email: decoded.email,
        role: decoded.role,
      };
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }, []);

  /**
   * Save token ke localStorage dan cookie
   */
  const saveToken = useCallback((token: string) => {
    // Save to localStorage untuk APIClient
    localStorage.setItem(TOKEN_KEY, token);

    // Save to cookie untuk middleware
    setCookie(TOKEN_COOKIE_NAME, token, {
      maxAge: TOKEN_MAX_AGE,
      path: '/',
      sameSite: 'strict',
    });
  }, []);

  /**
   * Remove token dari localStorage dan cookie
   */
  const clearToken = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    removeCookie(TOKEN_COOKIE_NAME, { path: '/' });
  }, []);

  /**
   * Initialize auth state dari token yang ada
   */
  useEffect(() => {
    const initAuth = () => {
      try {
        const token = localStorage.getItem(TOKEN_KEY);

        if (token) {
          const userData = decodeToken(token);

          if (userData) {
            setUser(userData);
            // Ensure cookie is set
            saveToken(token);
          } else {
            // Token expired atau invalid
            clearToken();
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        clearToken();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [decodeToken, saveToken, clearToken]);

  /**
   * Login function
   */
  const login = useCallback(
    async (email: string, password: string) => {
      try {
        setIsLoading(true);

        const response = await authAPI.login(email, password);

        if (!response.data) {
          throw new AuthenticationError(response.error || 'Login gagal');
        }

        const { token, user: userData } = response.data;

        // Save token
        saveToken(token);

        // Set user state
        setUser(userData);
      } catch (error) {
        clearToken();
        setUser(null);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [saveToken, clearToken]
  );

  /**
   * Logout function
   */
  const logout = useCallback(async () => {
    try {
      setIsLoading(true);

      // Call logout API (best effort, tidak throw error jika gagal)
      await authAPI.logout().catch((error) => {
        console.error('Logout API error:', error);
      });
    } finally {
      // Clear token dan user state
      clearToken();
      setUser(null);
      setIsLoading(false);
    }
  }, [clearToken]);

  /**
   * Update nama user
   */
  const updateNama = useCallback(
    async (nama: string) => {
      try {
        setIsLoading(true);

        const response = await profileAPI.updateNama({ nama });

        if (!response.data) {
          throw new Error(response.error || 'Gagal update nama');
        }

        // Update user state
        if (user) {
          setUser({ ...user, nama });
        }
      } finally {
        setIsLoading(false);
      }
    },
    [user]
  );

  /**
   * Update password user
   */
  const updatePassword = useCallback(async (oldPassword: string, newPassword: string) => {
    try {
      setIsLoading(true);

      const response = await profileAPI.updatePassword({
        kataSandiLama: oldPassword,
        kataSandiBaru: newPassword,
      });

      if (!response.data) {
        throw new Error(response.error || 'Gagal update password');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Refresh user data dari server
   */
  const refreshUser = useCallback(async () => {
    try {
      setIsLoading(true);

      const response = await profileAPI.get();

      if (!response.data) {
        throw new Error(response.error || 'Gagal refresh user data');
      }

      setUser(response.data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateNama,
    updatePassword,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
