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
  label: string;
  href: string;
  icon: React.ReactNode;
}

export interface NavigationGroup {
  title?: string;
  items: NavigationItem[];
}

export interface SidebarProps {
  /** Daftar navigation items (Legacy/Simple mode) */
  navigationItems?: NavigationItem[];
  /** Daftar navigation groups (Grouped mode) */
  navigationGroups?: NavigationGroup[];
  /** Status sidebar terbuka/tertutup (untuk mobile) */
  isOpen: boolean;
  /** Callback untuk menutup sidebar */
  onClose: () => void;
  /** Color theme variant */
  variant?: 'neutral' | 'sage' | 'emerald';
}

export const Sidebar: React.FC<SidebarProps> = ({
  navigationItems,
  navigationGroups,
  isOpen,
  onClose,
  variant = 'neutral',
}) => {
  const pathname = usePathname();
  const { user } = useAuth();

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  // Color Styles based on variant
  const getStyles = () => {
    switch (variant) {
      case 'sage':
        return {
          active: 'bg-sage-500 text-white shadow-md shadow-sage-200',
          inactive: 'text-neutral-600 hover:bg-sage-50 hover:text-sage-700',
          activeIcon: 'text-white',
          inactiveIcon: 'text-sage-400',
          border: 'border-sage-100',
        };
      case 'emerald':
        return {
          active: 'bg-emerald-600 text-white shadow-lg shadow-emerald-100',
          inactive: 'text-neutral-600 hover:bg-emerald-50 hover:text-emerald-700',
          activeIcon: 'text-white',
          inactiveIcon: 'text-emerald-500',
          border: 'border-emerald-100',
        };
      default:
        return {
          active: 'bg-neutral-900 text-white',
          inactive: 'text-neutral-700 hover:bg-neutral-100',
          activeIcon: 'text-white',
          inactiveIcon: 'text-neutral-500',
          border: 'border-neutral-200',
        };
    }
  };

  const styles = getStyles();

  // Helper to render a navigation list
  const renderNavList = (items: NavigationItem[]) => (
    <ul className="space-y-1.5">
      {items.map((item) => {
        const active = isActive(item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onClose}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl font-medium
                transition-all duration-200 group relative overflow-hidden
                ${active ? styles.active : styles.inactive}
              `}
            >
              <span
                className={`w-5 h-5 transition-colors ${active ? styles.activeIcon : styles.inactiveIcon
                  }`}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
              {active && variant !== 'neutral' && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full bg-white/20" />
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      {/* Backdrop untuk mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-72 bg-white border-r ${styles.border}
          transition-transform duration-300 ease-in-out shadow-xl md:shadow-none
          md:sticky md:top-0 md:h-screen md:translate-x-0 overflow-hidden flex flex-col
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full bg-white/50 backdrop-blur-xl">
          {/* Header sidebar (mobile only - or generic logo area) */}
          <div className={`flex items-center justify-between p-6 md:p-8 ${styles.border} md:border-none`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm">
                <img
                  src="/icons/icon-192x192.png"
                  alt="Posyandu Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="font-bold text-neutral-900 text-lg leading-tight">Posyandu<br />Lansia</h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-neutral-500 hover:bg-neutral-100 rounded-lg md:hidden"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* User Profile Summary (Desktop & Mobile) */}
          {user && (
            <div className="px-6 pb-6">
              <div
                className={`flex items-center gap-3 p-3 rounded-2xl border ${styles.border} bg-white/50`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${variant === 'sage' ? 'bg-sage-100 text-sage-700' :
                    variant === 'emerald' ? 'bg-emerald-100 text-emerald-700' : 'bg-neutral-100 text-neutral-700'
                  }`}>
                  {user.nama?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-neutral-900 truncate text-sm">
                    {user.nama}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${variant === 'sage' ? 'bg-sage-500' : 'bg-green-500'}`}></span>
                    <p className="text-xs text-neutral-500 capitalize">
                      {user.role?.toLowerCase()} &bull; Online
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation items */}
          <nav className="flex-1 overflow-y-auto px-6 pb-6 scrollbar-hide">
            {navigationGroups ? (
              <div className="space-y-8">
                {navigationGroups.map((group, idx) => (
                  <div key={idx}>
                    {group.title && (
                      <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-4 px-4">
                        {group.title}
                      </h3>
                    )}
                    {renderNavList(group.items)}
                  </div>
                ))}
              </div>
            ) : (
              navigationItems && renderNavList(navigationItems)
            )}
          </nav>

          {/* Footer */}
          <div className={`p-6 border-t ${styles.border}`}>
            <button
              onClick={() => window.location.href = '/login'} // Simple logout for prototype
              className="flex items-center gap-3 w-full px-4 py-3 text-neutral-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium text-sm group"
            >
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Keluar</span>
            </button>
            <p className="text-xs text-neutral-400 text-center mt-6">
              v1.0.0 &copy; 2026
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

Sidebar.displayName = 'Sidebar';
