/**
 * Route Guards Utility
 *
 * Responsible for route checking and access control logic.
 * Follows Single Responsibility Principle - only handles route validation.
 *
 * Separated from middleware to follow SRP:
 * - Middleware: Request/response handling
 * - Route guards: Route validation logic
 */

import type { UserRole } from '@/types';

/**
 * Public routes that don't require authentication
 */
const PUBLIC_ROUTES = ['/login', '/offline'];

/**
 * Route patterns for role-based access
 */
const ADMIN_ROUTES = ['/admin'];
const PETUGAS_ROUTES = ['/petugas'];

/**
 * Check if route is public (doesn't require authentication)
 *
 * @param pathname - URL pathname
 * @returns True if route is public
 */
export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
}

/**
 * Check if route is a static asset
 *
 * @param pathname - URL pathname
 * @returns True if route is a static asset
 */
export function isStaticAsset(pathname: string): boolean {
  return (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/icons') ||
    pathname.startsWith('/manifest.json') ||
    pathname.startsWith('/favicon.ico')
  );
}

/**
 * Check if user has access to route based on their role
 *
 * @param pathname - URL pathname
 * @param role - User role
 * @returns True if user has access
 */
export function hasAccess(pathname: string, role: UserRole): boolean {
  // Admin routes
  if (ADMIN_ROUTES.some((route) => pathname.startsWith(route))) {
    return role === 'ADMIN';
  }

  // Petugas routes
  if (PETUGAS_ROUTES.some((route) => pathname.startsWith(route))) {
    return role === 'PETUGAS';
  }

  // Default: allow access
  return true;
}

/**
 * Get dashboard URL based on user role
 *
 * @param role - User role
 * @returns Dashboard URL for the role
 */
export function getDashboardUrl(role: UserRole): string {
  return role === 'ADMIN' ? '/admin/dashboard' : '/petugas/dashboard';
}

/**
 * Check if route requires authentication
 *
 * @param pathname - URL pathname
 * @returns True if route requires authentication
 */
export function requiresAuth(pathname: string): boolean {
  return !isPublicRoute(pathname) && !isStaticAsset(pathname);
}
