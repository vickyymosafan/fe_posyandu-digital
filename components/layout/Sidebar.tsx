'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/hooks';

/**
 * Sidebar Component
 * 
 * Komponen sidebar dengan navigation menu yang responsive.
 * Di mobile: drawer yang dapat dibuka/tutup
 * Di desktop: fixed sidebar di sebelah kiri
 * 
 * Mengikuti prinsip:
 * - SRP: Hanya bertanggung jawab untuk rendering navigation
 * - OCP: Navigation items dapat diperluas melalui props
 * - Composition: Menggunakan NavigationItem sub-komponen
 */

export interface NavigationItem {
  /** Label menu */
  label: string;
  /** Path URL */
  href: string;
  /** Icon SVG */
  icon: React.ReactNode;
}

export interface SidebarProps {
  /** Daftar navigation items */
  navigationItems: NavigationItem[];
  /** Status sidebar terbuka/tertutup (untuk mobile) */
  isOpen: boolean;
  /** Callback untuk menutup sidebar */
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  navigationItems,
  isOpen,
  onClose,
}) => {
  const pathname = usePathname();
  const { user } = useAuth();

  /**
   * Check if route is active
   */
  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <>
      {/* Backdrop untuk mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-neutral-200 
          transition-transform duration-300 ease-in-out
          md:sticky md:top-16 md:h-[calc(100vh-4rem)] md:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header sidebar (mobile only) */}
          <div className="flex items-center justify-between p-4 border-b border-neutral-200 md:hidden">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <h2 className="font-bold text-neutral-900">Menu</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
              aria-label="Tutup menu"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* User info (mobile only) */}
          {user && (
            <div className="flex items-center gap-3 p-4 border-b border-neutral-200 md:hidden">
              <div className="w-10 h-10 bg-neutral-900 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">
                  {user.nama.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-neutral-900 truncate">{user.nama}</p>
                <p className="text-sm text-neutral-600 capitalize">{user.role}</p>
              </div>
            </div>
          )}

          {/* Navigation items */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {navigationItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={`
                        flex items-center gap-3 px-4 py-3 rounded-xl
                        transition-all duration-300
                        ${
                          active
                            ? 'bg-neutral-900 text-white font-medium'
                            : 'text-neutral-700 hover:bg-neutral-100'
                        }
                      `}
                    >
                      <span className={`w-5 h-5 ${active ? 'text-white' : 'text-neutral-500'}`}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-neutral-200">
            <p className="text-xs text-neutral-500 text-center">
              Posyandu Lansia v1.0.0
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

Sidebar.displayName = 'Sidebar';
