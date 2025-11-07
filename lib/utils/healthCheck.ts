/**
 * Health Check Utility
 *
 * Utility untuk check apakah backend server berjalan.
 * Berguna untuk debugging dan error handling.
 */

import {
  HEALTH_CHECK_TIMEOUT_MS,
  CONSOLE_SEPARATOR,
  CONSOLE_SUB_SEPARATOR,
} from '@/lib/constants';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://be-posyandu-digital.vercel.app';
const BACKEND_BASE_URL = API_URL.replace('/api', '');

/**
 * Check if backend server is running
 *
 * @returns Promise<boolean> - true jika server running, false jika tidak
 */
export async function checkBackendHealth(): Promise<boolean> {
  try {
    console.log('[HealthCheck] Checking backend health at:', `${BACKEND_BASE_URL}/health`);
    
    const response = await fetch(`${BACKEND_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(HEALTH_CHECK_TIMEOUT_MS),
    });

    const isHealthy = response.ok;
    
    if (isHealthy) {
      const data = await response.json();
      console.log('[HealthCheck] ✅ Backend is healthy:', data);
    } else {
      console.error('[HealthCheck] ❌ Backend returned error:', response.status, response.statusText);
    }

    return isHealthy;
  } catch (error) {
    console.error('[HealthCheck] ❌ Backend is not reachable:', error);
    console.error('[HealthCheck] Make sure backend is running at:', BACKEND_BASE_URL);
    return false;
  }
}

/**
 * Check backend health and log detailed information
 */
export async function checkBackendHealthVerbose(): Promise<void> {
  console.log(CONSOLE_SEPARATOR);
  console.log('🏥 BACKEND HEALTH CHECK');
  console.log(CONSOLE_SEPARATOR);
  console.log('Backend URL:', BACKEND_BASE_URL);
  console.log('API URL:', API_URL);
  console.log('Health endpoint:', `${BACKEND_BASE_URL}/health`);
  console.log(CONSOLE_SUB_SEPARATOR);

  const isHealthy = await checkBackendHealth();

  if (isHealthy) {
    console.log('✅ Backend is HEALTHY and REACHABLE');
  } else {
    console.error('❌ Backend is NOT REACHABLE');
    console.error('');
    console.error('Troubleshooting steps:');
    console.error('1. Check if backend server is running');
    console.error('2. Verify backend is running on correct port (default: 3001)');
    console.error('3. Check NEXT_PUBLIC_API_URL in .env.local');
    console.error('4. Check for CORS issues in browser console');
    console.error('5. Try accessing health endpoint directly:', `${BACKEND_BASE_URL}/health`);
  }

  console.log(CONSOLE_SEPARATOR);
}
