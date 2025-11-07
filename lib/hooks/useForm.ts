/**
 * Generic Form Hook
 * 
 * Reusable form logic following DRY principle.
 * Eliminates duplication across all form hooks.
 * 
 * Features:
 * - Generic state management
 * - Zod schema validation
 * - Realtime field validation
 * - Submit handling with error management
 * - Password visibility toggle
 */

import { useState, useCallback } from 'react';
import { z } from 'zod';

export interface UseFormOptions<T extends Record<string, unknown>> {
  initialValues: T;
  validationSchema: z.ZodSchema<T>;
  onSubmit: (values: T) => Promise<void>;
}

export interface UseFormReturn<T extends Record<string, unknown>> {
  formData: T;
  errors: Partial<Record<keyof T, string>>;
  isSubmitting: boolean;
  showPassword: Record<string, boolean>;
  handleChange: (field: keyof T, value: unknown) => void;
  togglePasswordVisibility: (field: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  resetForm: () => void;
  setFieldError: (field: keyof T, error: string) => void;
  clearFieldError: (field: keyof T) => void;
}

/**
 * Generic form hook with validation and submission handling
 */
export function useForm<T extends Record<string, unknown>>({
  initialValues,
  validationSchema,
  onSubmit,
}: UseFormOptions<T>): UseFormReturn<T> {
  const [formData, setFormData] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});

  /**
   * Validate single field
   */
  const validateField = useCallback(
    (field: keyof T, value: unknown): string | undefined => {
      try {
        // Try to validate just this field if schema supports it
        if (validationSchema instanceof z.ZodObject) {
          const fieldSchema = validationSchema.shape[field as string];
          if (fieldSchema) {
            fieldSchema.parse(value);
          }
        }
        return undefined;
      } catch (error) {
        if (error instanceof z.ZodError) {
          return error.issues[0]?.message;
        }
        return 'Invalid value';
      }
    },
    [validationSchema]
  );

  /**
   * Handle field change with realtime validation
   */
  const handleChange = useCallback(
    (field: keyof T, value: unknown) => {
      setFormData((prev) => ({ ...prev, [field]: value }));

      // Realtime validation
      const error = validateField(field, value);
      setErrors((prev) => {
        const newErrors = { ...prev };
        if (error) {
          newErrors[field] = error;
        } else {
          delete newErrors[field];
        }
        return newErrors;
      });
    },
    [validateField]
  );

  /**
   * Toggle password visibility for a field
   */
  const togglePasswordVisibility = useCallback((field: string) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  }, []);

  /**
   * Validate entire form
   */
  const validateForm = useCallback((): boolean => {
    try {
      validationSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof T, string>> = {};
        error.issues.forEach((err) => {
          const field = err.path[0] as keyof T;
          if (field) {
            newErrors[field] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  }, [formData, validationSchema]);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      setIsSubmitting(true);
      try {
        await onSubmit(formData);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, validateForm, onSubmit]
  );

  /**
   * Reset form to initial values
   */
  const resetForm = useCallback(() => {
    setFormData(initialValues);
    setErrors({});
    setShowPassword({});
  }, [initialValues]);

  /**
   * Set error for specific field
   */
  const setFieldError = useCallback((field: keyof T, error: string) => {
    setErrors((prev) => ({ ...prev, [field]: error }));
  }, []);

  /**
   * Clear error for specific field
   */
  const clearFieldError = useCallback((field: keyof T) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  return {
    formData,
    errors,
    isSubmitting,
    showPassword,
    handleChange,
    togglePasswordVisibility,
    handleSubmit,
    resetForm,
    setFieldError,
    clearFieldError,
  };
}
