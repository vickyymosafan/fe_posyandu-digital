'use client';

import React, { useState } from 'react';
import { Header } from './Header';
import { Sidebar, NavigationItem } from './Sidebar';

/**
 * PetugasLayout Component
 * 
 * Layout khusus untuk role Petugas dengan navigation items yang sesuai.
 * Mengikuti prinsip Composition Over Inheritance - compose Header + Sidebar.
 */

// Navigation items untuk Petugas
const petugasNavigationItems: NavigationItem[] = [
  {
    label: 'Dashboard',
    href: '/petugas/dashboard',
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
  },
  {
    label: 'Pendaftaran Lansia',
    href: '/petugas/lansia/daftar',
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
        />
      </svg>
    ),
  },
  {
    label: 'Pencarian Lansia',
    href: '/petugas/lansia/cari',
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    ),
  },
  {
    label: 'Daftar Lansia',
    href: '/petugas/lansia',
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
  },
  {
    label: 'Profil',
    href: '/petugas/profil',
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
  },
];

export interface PetugasLayoutProps {
  children: React.ReactNode;
}

export const PetugasLayout: React.FC<PetugasLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <Header onMenuClick={handleToggleSidebar} showMenuButton />

      {/* Layout container */}
      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          navigationItems={petugasNavigationItems}
          isOpen={isSidebarOpen}
          onClose={handleCloseSidebar}
        />

        {/* Main content */}
        <main className="flex-1 min-w-0">
          <div className="container mx-auto px-4 py-6 md:px-6 md:py-8 max-w-screen-2xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

PetugasLayout.displayName = 'PetugasLayout';
