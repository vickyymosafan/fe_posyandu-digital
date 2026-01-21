import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './useAuth';
import { useNotification } from '@/components/ui';
import { loginFormSchema } from '@/lib/utils/validators';
import { handleAPIError } from '@/lib/utils/errors';
import type { UserRole } from '@/types';

/**
 * useLoginForm Hook
 * 
 * Custom hook untuk handle login form logic.
 * Mengikuti prinsip:
 * - SRP: Hanya handle form state dan validation
 * - SoC: Memisahkan form logic dari UI
 * - DIP: Bergantung pada useAuth abstraction
 */

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginFormErrors {
  email?: string;
  password?: string;
}

interface UseLoginFormReturn {
  formData: LoginFormData;
  errors: LoginFormErrors;
  isSubmitting: boolean;
  showPassword: boolean;
  handleEmailChange: (value: string) => void;
  handlePasswordChange: (value: string) => void;
  togglePasswordVisibility: () => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

export function useLoginForm(): UseLoginFormReturn {
  const router = useRouter();
  const { login } = useAuth();
  const { showNotification } = useNotification();

  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  /**
   * Validate single field
   */
  const validateField = (field: keyof LoginFormData, value: string) => {
    try {
      if (field === 'email') {
        loginFormSchema.shape.email.parse(value);
      } else if (field === 'password') {
        loginFormSchema.shape.password.parse(value);
      }
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    } catch (error) {
      const errorMessage =
        error instanceof Error && 'errors' in error
          ? (error as { errors: Array<{ message: string }> }).errors[0]?.message
          : 'Invalid value';
      setErrors((prev) => ({ ...prev, [field]: errorMessage }));
    }
  };

  /**
   * Handle email change dengan validation
   */
  const handleEmailChange = (value: string) => {
    setFormData((prev) => ({ ...prev, email: value }));
    if (value) {
      validateField('email', value);
    } else {
      setErrors((prev) => ({ ...prev, email: undefined }));
    }
  };

  /**
   * Handle password change dengan validation
   */
  const handlePasswordChange = (value: string) => {
    setFormData((prev) => ({ ...prev, password: value }));
    if (value) {
      validateField('password', value);
    } else {
      setErrors((prev) => ({ ...prev, password: undefined }));
    }
  };

  /**
   * Toggle password visibility
   */
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  /**
   * Get dashboard URL based on role
   */
  const getDashboardUrl = (role: UserRole): string => {
    return role === 'ADMIN' ? '/admin/dashboard' : '/petugas/dashboard';
  };

  /**
   * Handle form submit
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    try {
      loginFormSchema.parse(formData);
      setErrors({});
    } catch (error) {
      const fieldErrors: LoginFormErrors = {};
      if (error instanceof Error && 'errors' in error) {
        const zodError = error as { errors: Array<{ path: string[]; message: string }> };
        zodError.errors?.forEach((err) => {
          const field = err.path[0] as keyof LoginFormData;
          fieldErrors[field] = err.message;
        });
      }
      setErrors(fieldErrors);
      return;
    }

    // Submit login
    setIsSubmitting(true);

    try {
      // Login dan dapatkan user data langsung
      const userData = await login(formData.email, formData.password);

      // Show success notification
      showNotification('success', 'Login berhasil');

      // Redirect based on role dari user data yang dikembalikan
      const dashboardUrl = getDashboardUrl(userData.role);
      router.push(dashboardUrl);
    } catch (error) {
      const errorMessage = handleAPIError(error);
      showNotification('error', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    errors,
    isSubmitting,
    showPassword,
    handleEmailChange,
    handlePasswordChange,
    togglePasswordVisibility,
    handleSubmit,
  };
}
