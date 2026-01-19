'use client';

import React, { useState } from 'react';
import { Header } from './Header';
import { Sidebar, NavigationItem } from './Sidebar';
import { ROUTES } from '@/lib/constants/navigation';

/**
 * PetugasLayout Component
 * 
 * Layout khusus untuk role Petugas dengan navigation items yang sesuai.
 * Mengikuti prinsip Composition Over Inheritance - compose Header + Sidebar.
 * 
 * Design Principles:
 * - SRP: Hanya bertanggung jawab untuk layout composition
 * - DRY: Route paths diambil dari constants yang terpusat
 * - OCP: Mudah diperluas tanpa mengubah kode internal
 */

// Navigation groups untuk Petugas (aligned with Admin structure)
const petugasNavigationGroups = [
  {
    title: 'Menu Utama',
    items: [
      {
        label: 'Dashboard',
        href: ROUTES.PETUGAS.DASHBOARD,
        icon: (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        ),
      },
      {
        label: 'Daftar Lansia',
        href: ROUTES.PETUGAS.LANSIA,
        icon: (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        ),
      },
    ],
  },
  {
    title: 'Akun',
    items: [
      {
        label: 'Profil Saya',
        href: ROUTES.PETUGAS.PROFIL,
        icon: (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        ),
      },
    ],
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
          navigationGroups={petugasNavigationGroups}
          isOpen={isSidebarOpen}
          onClose={handleCloseSidebar}
          variant="emerald"
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
