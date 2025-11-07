'use client';

import React from 'react';
import { useAuth } from '@/lib/hooks';
import { Button } from '@/components/ui';
import { OfflineIndicator } from '@/components';

/**
 * Header Component
 * 
 * Komponen header dengan logo, user info, offline indicator, dan logout button.
 * Mengikuti prinsip SRP - hanya bertanggung jawab untuk rendering header.
 * Mengikuti prinsip DIP - bergantung pada useAuth abstraction.
 */

export interface HeaderProps {
  /** Callback untuk toggle sidebar di mobile */
  onMenuClick?: () => void;
  /** Show menu button (untuk mobile) */
  showMenuButton?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onMenuClick,
  showMenuButton = true,
}) => {
  const { user, logout, isLoading } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      // Redirect akan ditangani oleh middleware
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-neutral-200 shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        {/* Left section: Menu button (mobile) + Logo */}
        <div className="flex items-center gap-4">
          {/* Hamburger menu button - hanya tampil di mobile */}
          {showMenuButton && (
            <button
              onClick={onMenuClick}
              className="p-2 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors md:hidden"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          )}

          {/* Logo dan nama aplikasi */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center">
              <img 
                src="/logo.webp" 
                alt="Posyandu Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-neutral-900">Posyandu Lansia</h1>
            </div>
          </div>
        </div>

        {/* Right section: Offline indicator + User info + Logout */}
        <div className="flex items-center gap-3">
          {/* Offline indicator */}
          <OfflineIndicator />

          {/* User info */}
          {user && user.nama && (
            <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-neutral-50 rounded-lg">
              <div className="w-8 h-8 bg-neutral-900 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user.nama.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="text-sm">
                <p className="font-medium text-neutral-900">{user.nama}</p>
                <p className="text-xs text-neutral-600 capitalize">
                  {user.role?.toLowerCase() || 'user'}
                </p>
              </div>
            </div>
          )}

          {/* Logout button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            isLoading={isLoading}
            aria-label="Logout"
            className="hidden md:inline-flex"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span className="ml-2">Logout</span>
          </Button>

          {/* Logout button mobile (icon only) */}
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="md:hidden p-2 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors disabled:opacity-50"
            aria-label="Logout"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

Header.displayName = 'Header';
