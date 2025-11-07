/**
 * Token Storage Utility
 *
 * Responsible for managing JWT token storage in localStorage.
 * Follows Single Responsibility Principle - only handles token persistence.
 *
 * Separated from API client to follow SRP:
 * - API client: HTTP communication
 * - Token storage: Token persistence
 */

/**
 * Token key for localStorage
 */
const TOKEN_KEY = 'auth_token';

/**
 * Get JWT token from localStorage
 *
 * @returns Token string or null if not found
 */
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Set JWT token to localStorage
 *
 * @param token - JWT token string
 */
export function setToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
}

/**
 * Remove JWT token from localStorage
 */
export function removeToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * Check if token exists in localStorage
 *
 * @returns True if token exists
 */
export function hasToken(): boolean {
  return getToken() !== null;
}
