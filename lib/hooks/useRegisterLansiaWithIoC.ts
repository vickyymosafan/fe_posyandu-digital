/**
 * Register Lansia Hook with IoC
 *
 * Demonstrates Inversion of Control in React hooks.
 * Instead of creating dependencies, they are injected via DI container.
 *
 * Before IoC:
 * ```typescript
 * const repository = new IndexedDBLansiaRepository(); // Direct instantiation
 * const useCase = new RegisterLansiaUseCase(repository, generateIdPasien);
 * ```
 *
 * After IoC:
 * ```typescript
 * const useCase = useDependency(DependencyKeys.REGISTER_LANSIA_USE_CASE); // Injected
 * ```
 *
 * Benefits:
 * - No knowledge of concrete implementations
 * - Easy to test (inject mocks)
 * - Easy to swap implementations
 * - Follows Dependency Inversion Principle
 */

'use client';

import { useState, useCallback } from 'react';
import { useDependency } from '../di/DIProvider';
import { DependencyKeys } from '../di/Container';
import { RegisterLansiaUseCase } from '../use-cases/RegisterLansiaUseCase';
import { NOTIFICATION_DURATION_MS } from '../constants';
import { useNotification } from '@/components/ui/Notification';
import type { CreateLansiaDTO } from '../domain/entities/Lansia';

/**
 * Hook for registering lansia using IoC
 *
 * This hook demonstrates proper IoC:
 * 1. Dependencies are injected, not created
 * 2. Hook doesn't know about concrete implementations
 * 3. Easy to test with mock dependencies
 * 4. Follows SOLID principles
 */
export function useRegisterLansiaWithIoC() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // IoC: Dependency is injected via container
  // Hook doesn't create the use case, it receives it
  const registerUseCase = useDependency<RegisterLansiaUseCase>(
    DependencyKeys.REGISTER_LANSIA_USE_CASE
  );

  const { showNotification } = useNotification();

  /**
   * Register a new lansia
   * Business logic is in the use case, hook only handles UI concerns
   */
  const register = useCallback(
    async (data: CreateLansiaDTO) => {
      setIsSubmitting(true);
      setError(null);
      setValidationErrors({});

      try {
        // Execute use case (injected dependency)
        const result = await registerUseCase.execute(data);

        if (result.success) {
          showNotification(
            'success',
            'Lansia berhasil didaftarkan',
            NOTIFICATION_DURATION_MS
          );
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
        showNotification('error', errorMessage, NOTIFICATION_DURATION_MS);
        return {
          success: false,
          error: errorMessage,
        };
      } finally {
        setIsSubmitting(false);
      }
    },
    [registerUseCase, showNotification]
  );

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
 * ```tsx
 * function RegisterLansiaForm() {
 *   const { register, isSubmitting, error, validationErrors } = useRegisterLansiaWithIoC();
 *
 *   const handleSubmit = async (formData) => {
 *     const result = await register(formData);
 *     if (result.success) {
 *       // Navigate to detail page
 *     }
 *   };
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       {error && <ErrorMessage>{error}</ErrorMessage>}
 *       {/* Form fields *\/}
 *     </form>
 *   );
 * }
 * ```
 *
 * Testing:
 *
 * ```tsx
 * test('useRegisterLansiaWithIoC', () => {
 *   const mockContainer = new DIContainer();
 *   mockContainer.registerTransient(
 *     DependencyKeys.REGISTER_LANSIA_USE_CASE,
 *     () => mockUseCase
 *   );
 *
 *   const { result } = renderHook(() => useRegisterLansiaWithIoC(), {
 *     wrapper: ({ children }) => (
 *       <DIProvider container={mockContainer}>{children}</DIProvider>
 *     ),
 *   });
 *
 *   // Test with mock use case
 * });
 * ```
 */
