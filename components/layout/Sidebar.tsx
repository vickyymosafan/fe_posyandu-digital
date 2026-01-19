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
  variant?: 'neutral' | 'emerald';
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
    if (variant === 'emerald') {
      return {
        active: 'bg-emerald-600 text-white shadow-lg shadow-emerald-100',
        inactive: 'text-neutral-600 hover:bg-emerald-50 hover:text-emerald-700',
        activeIcon: 'text-white',
        inactiveIcon: 'text-emerald-500',
        border: 'border-emerald-100',
      };
    }
    // Default (neutral)
    return {
      active: 'bg-neutral-900 text-white',
      inactive: 'text-neutral-700 hover:bg-neutral-100',
      activeIcon: 'text-white',
      inactiveIcon: 'text-neutral-500',
      border: 'border-neutral-200',
    };
  };

  const styles = getStyles();

  // Helper to render a navigation list
  const renderNavList = (items: NavigationItem[]) => (
    <ul className="space-y-1">
      {items.map((item) => {
        const active = isActive(item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onClose}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                min-h-[44px] transition-all duration-200 group
                ${active ? styles.active : styles.inactive}
              `}
            >
              <span
                className={`w-5 h-5 flex-shrink-0 transition-colors ${active ? styles.activeIcon : styles.inactiveIcon
                  }`}
              >
                {item.icon}
              </span>
              <span className="truncate">{item.label}</span>
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
          fixed top-0 left-0 z-50 h-full w-[280px] bg-white border-r ${styles.border}
          transition-transform duration-300 ease-in-out shadow-xl md:shadow-none
          md:sticky md:top-0 md:h-screen md:translate-x-0 overflow-hidden flex flex-col
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header sidebar (mobile only - close button) */}
          <div className={`flex items-center justify-end p-4 md:hidden ${styles.border}`}>
            <button
              onClick={onClose}
              className="p-2 text-neutral-500 hover:bg-neutral-100 rounded-lg"
              aria-label="Tutup menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* User Profile Summary (Desktop & Mobile) */}
          {user && (
            <div className="p-4 md:pt-6">
              <div
                className={`flex items-center gap-3 p-3 rounded-xl border ${styles.border} bg-neutral-50/50`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${variant === 'emerald' ? 'bg-emerald-100 text-emerald-700' : 'bg-neutral-100 text-neutral-700'}`}>
                  {user.nama?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-neutral-900 truncate text-sm">
                    {user.nama}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${variant === 'emerald' ? 'bg-emerald-500' : 'bg-green-500'}`}></span>
                    <p className="text-xs text-neutral-500 capitalize">
                      {user.role?.toLowerCase()} &bull; Online
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation items */}
          <nav className="flex-1 overflow-y-auto px-4 pb-4">
            {navigationGroups ? (
              <div className="space-y-6">
                {navigationGroups.map((group, idx) => (
                  <div key={idx}>
                    {group.title && (
                      <h3 className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2 px-3">
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
          <div className={`p-4 border-t ${styles.border} mt-auto`}>
            <button
              onClick={() => window.location.href = '/login'}
              className="flex items-center gap-3 w-full px-3 py-2.5 text-neutral-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium text-sm min-h-[44px]"
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Keluar</span>
            </button>
            <p className="text-[10px] text-neutral-400 text-center mt-4">
              v1.0.0
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

Sidebar.displayName = 'Sidebar';
