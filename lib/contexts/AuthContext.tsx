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
import { getToken, setToken as saveTokenToStorage, removeToken as removeTokenFromStorage } from '@/lib/utils/tokenStorage';
import { AuthenticationError } from '@/lib/utils/errors';

// ============================================
// Types
// ============================================

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
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
    saveTokenToStorage(token);

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
    removeTokenFromStorage();
    removeCookie(TOKEN_COOKIE_NAME, { path: '/' });
  }, []);

  /**
   * Initialize auth state dari token yang ada
   */
  useEffect(() => {
    const initAuth = () => {
      try {
        const token = getToken();

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
   * Returns user data untuk immediate redirect
   * FAIL FAST: Validate input immediately
   */
  const login = useCallback(
    async (email: string, password: string): Promise<User> => {
      // FAIL FAST: Validate input
      if (!email || email.trim().length === 0) {
        console.error('❌ [AuthContext] Login failed - empty email');
        throw new AuthenticationError('Email tidak boleh kosong');
      }

      if (!password || password.length === 0) {
        console.error('❌ [AuthContext] Login failed - empty password');
        throw new AuthenticationError('Password tidak boleh kosong');
      }

      console.log('[AuthContext] Login attempt:', {
        email,
        timestamp: new Date().toISOString(),
      });

      try {
        setIsLoading(true);

        console.log('[AuthContext] Calling authAPI.login...');
        const response = await authAPI.login(email, password);

        console.log('[AuthContext] Login response received:', {
          hasData: !!response.data,
          hasError: !!response.error,
          response: response,
          responseKeys: Object.keys(response),
          timestamp: new Date().toISOString(),
        });

        if (!response.data) {
          console.error('[AuthContext] Login failed - no data:', {
            error: response.error,
            timestamp: new Date().toISOString(),
          });
          throw new AuthenticationError(response.error || 'Login gagal');
        }

        const { token, user: userData } = response.data;

        // Ensure email is present - backend might not return it in user object
        // Fallback chain: API response -> JWT decode -> login input
        let completeUser: User = userData;
        if (!userData.email) {
          const decodedUser = decodeToken(token);
          completeUser = {
            ...userData,
            email: decodedUser?.email || email,
          };
        }

        console.log('[AuthContext] Login successful:', {
          userId: completeUser.id,
          userName: completeUser.nama,
          userEmail: completeUser.email,
          userRole: completeUser.role,
          hasToken: !!token,
          timestamp: new Date().toISOString(),
        });

        // Save token
        saveToken(token);
        console.log('[AuthContext] Token saved to localStorage and cookie');

        // Set user state
        setUser(completeUser);
        console.log('[AuthContext] User state updated');

        // Return user data untuk immediate use
        return completeUser;
      } catch (error) {
        console.error('[AuthContext] Login error:', {
          error: error instanceof Error ? error.message : 'Unknown error',
          errorType: error instanceof Error ? error.constructor.name : 'Unknown',
          timestamp: new Date().toISOString(),
        });

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
   * FAIL FAST: Validate input immediately
   */
  const updateNama = useCallback(
    async (nama: string) => {
      // FAIL FAST: Validate input
      if (!nama || nama.trim().length === 0) {
        console.error('❌ [AuthContext] Update nama failed - empty nama');
        throw new Error('Nama tidak boleh kosong');
      }

      if (!user) {
        console.error('❌ [AuthContext] Update nama failed - no user');
        throw new AuthenticationError('User tidak ditemukan');
      }

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
   * FAIL FAST: Validate input immediately
   */
  const updatePassword = useCallback(async (oldPassword: string, newPassword: string) => {
    // FAIL FAST: Validate input
    if (!oldPassword || oldPassword.length === 0) {
      console.error('❌ [AuthContext] Update password failed - empty old password');
      throw new Error('Password lama tidak boleh kosong');
    }

    if (!newPassword || newPassword.length === 0) {
      console.error('❌ [AuthContext] Update password failed - empty new password');
      throw new Error('Password baru tidak boleh kosong');
    }

    if (newPassword.length < 6) {
      console.error('❌ [AuthContext] Update password failed - password too short');
      throw new Error('Password baru minimal 6 karakter');
    }

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
