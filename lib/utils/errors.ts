/**
 * Custom Error Classes untuk API Error Handling
 *
 * File ini berisi custom error classes yang digunakan untuk
 * menangani berbagai jenis error dari API.
 *
 * Mengikuti prinsip:
 * - SRP: Setiap error class hanya handle satu jenis error
 * - OCP: Mudah diperluas dengan error class baru
 */

/**
 * Base class untuk semua application errors
 */
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Error untuk validasi input
 */
export class ValidationError extends AppError {
  constructor(message: string, public details?: unknown) {
    super(message, 400);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * Error untuk autentikasi (401)
 */
export class AuthenticationError extends AppError {
  constructor(message: string = 'Autentikasi diperlukan') {
    super(message, 401);
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

/**
 * Error untuk otorisasi (403)
 */
export class AuthorizationError extends AppError {
  constructor(message: string = 'Akses ditolak') {
    super(message, 403);
    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }
}

/**
 * Error untuk resource tidak ditemukan (404)
 */
export class NotFoundError extends AppError {
  constructor(message: string = 'Resource tidak ditemukan') {
    super(message, 404);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

/**
 * Error untuk timeout request
 */
export class TimeoutError extends AppError {
  constructor(message: string = 'Request timeout, silakan coba lagi') {
    super(message, 408);
    Object.setPrototypeOf(this, TimeoutError.prototype);
  }
}

/**
 * Error untuk server error (500)
 */
export class ServerError extends AppError {
  constructor(message: string = 'Terjadi kesalahan pada server') {
    super(message, 500);
    Object.setPrototypeOf(this, ServerError.prototype);
  }
}

/**
 * Error untuk network error
 */
export class NetworkError extends AppError {
  constructor(message: string = 'Tidak dapat terhubung ke server') {
    super(message, 0);
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}

/**
 * Handler untuk mengkonversi unknown error menjadi user-friendly message
 */
export function handleAPIError(error: unknown): string {
  if (error instanceof AppError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Terjadi kesalahan yang tidak diketahui';
}
