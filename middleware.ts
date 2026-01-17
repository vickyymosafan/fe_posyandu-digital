/**
 * Next.js Middleware untuk Route Protection
 *
 * Middleware ini melakukan:
 * - Authentication check untuk protected routes
 * - Role-based access control
 * - Redirect ke halaman yang sesuai
 *
 * Mengikuti prinsip:
 * - SRP: Hanya handle request/response flow (route logic di routeGuards.ts)
 * - Security: First line of defense (bukan security layer utama)
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';
import { isPublicRoute, isStaticAsset, hasAccess, getDashboardUrl } from '@/lib/utils/routeGuards';

// ============================================
// Types
// ============================================

type UserRole = 'ADMIN' | 'PETUGAS';

interface JWTPayload {
  id: number;
  email: string;
  nama: string;
  role: UserRole;
  iat: number;
  exp: number;
}

// ============================================
// Constants
// ============================================

const TOKEN_COOKIE_NAME = 'auth_token';

// ============================================
// Helper Functions
// ============================================

/**
 * Decode dan validate JWT token
 */
function decodeToken(token: string): JWTPayload | null {
  try {
    const decoded = jwtDecode<JWTPayload>(token);

    // Check if token expired
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp < now) {
      return null;
    }

    return decoded;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

// ============================================
// Middleware
// ============================================

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow static assets
  if (isStaticAsset(pathname)) {
    return NextResponse.next();
  }

  // Get token from cookie
  const token = request.cookies.get(TOKEN_COOKIE_NAME)?.value;

  // Allow public routes
  if (isPublicRoute(pathname)) {
    // Jika sudah login dan akses login page, redirect ke dashboard
    if (pathname === '/login' && token) {
      const decoded = decodeToken(token);
      if (decoded) {
        const dashboardUrl = getDashboardUrl(decoded.role);
        return NextResponse.redirect(new URL(dashboardUrl, request.url));
      }
    }
    return NextResponse.next();
  }

  // Protected routes - require authentication
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Decode token
  const decoded = decodeToken(token);

  if (!decoded) {
    // Token invalid atau expired
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    const response = NextResponse.redirect(loginUrl);
    // Clear invalid token
    response.cookies.delete(TOKEN_COOKIE_NAME);
    return response;
  }

  // Check role-based access
  if (!hasAccess(pathname, decoded.role)) {
    // Redirect ke dashboard sesuai role
    const dashboardUrl = getDashboardUrl(decoded.role);
    return NextResponse.redirect(new URL(dashboardUrl, request.url));
  }

  // Root path - redirect ke dashboard sesuai role
  if (pathname === '/') {
    const dashboardUrl = getDashboardUrl(decoded.role);
    return NextResponse.redirect(new URL(dashboardUrl, request.url));
  }

  return NextResponse.next();
}

// ============================================
// Config
// ============================================

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes (handled by backend)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|icons|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
