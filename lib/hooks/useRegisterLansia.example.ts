/**
 * Example: React Hook using Clean Architecture
 *
 * This demonstrates how to use Clean Architecture in a React hook.
 * The hook is now a thin wrapper that:
 * 1. Manages React-specific state
 * 2. Delegates business logic to use cases
 * 3. Handles UI concerns (loading, errors)
 *
 * Benefits:
 * - Business logic is testable without React
 * - Hook is simple and focused on UI concerns
 * - Easy to swap implementations (e.g., different repository)
 */

'use client';

import { useState, useCallback } from 'react';
import { RegisterLansiaUseCase } from '../use-cases/RegisterLansiaUseCase';
import { IndexedDBLansiaRepository } from '../infrastructure/repositories/IndexedDBLansiaRepository';
import { generateIdPasien } from '../utils/generateIdPasien';
import type { CreateLansiaDTO } from '../domain/entities/Lansia';

/**
 * Hook for registering lansia using Clean Architecture
 *
 * This hook:
 * - Manages UI state (loading, errors)
 * - Delegates business logic to use case
 * - Provides clean API for components
 */
export function useRegisterLansia() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  /**
   * Register a new lansia
   * All business logic is in the use case
   */
  const register = useCallback(async (data: CreateLansiaDTO) => {
    setIsSubmitting(true);
    setError(null);
    setValidationErrors({});

    try {
      // Create use case with dependencies
      // In a real app, these would be injected via DI container
      const repository = new IndexedDBLansiaRepository();
      const useCase = new RegisterLansiaUseCase(repository, generateIdPasien);

      // Execute use case
      const result = await useCase.execute(data);

      if (result.success) {
        return {
          success: true,
          lansia: result.lansia,
        };
      } else {
        setError(result.error || 'Gagal mendaftarkan lansia');
        if (result.validationErrors) {
          setValidationErrors(result.validationErrors);
        }
        return {
          success: false,
          error: result.error,
        };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return {
    register,
    isSubmitting,
    error,
    validationErrors,
  };
}

/**
 * Usage in a component:
 *
 * function RegisterLansiaForm() {
 *   const { register, isSubmitting, error, validationErrors } = useRegisterLansia();
 *
 *   const handleSubmit = async (formData) => {
 *     const result = await register(formData);
 *     if (result.success) {
 *       // Show success message
 *       // Navigate to detail page
 *     }
 *   };
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       {error && <ErrorMessage>{error}</ErrorMessage>}
 *       {/* Form fields with validationErrors *\/}
 *     </form>
 *   );
 * }
 */
