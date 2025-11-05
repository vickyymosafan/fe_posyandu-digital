import React from 'react';

/**
 * Input Component
 * 
 * Komponen input field yang dapat digunakan kembali dengan validasi dan feedback visual.
 * Mengikuti prinsip SRP - hanya bertanggung jawab untuk rendering input field.
 * Mengikuti prinsip ISP - interface props yang fokus dan tidak memaksa props yang tidak diperlukan.
 */

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Label untuk input */
  label?: string;
  /** Pesan error */
  error?: string;
  /** Pesan helper */
  helperText?: string;
  /** Status validasi */
  validationState?: 'error' | 'success' | 'default';
  /** Icon di sebelah kiri */
  leftIcon?: React.ReactNode;
  /** Icon di sebelah kanan */
  rightIcon?: React.ReactNode;
  /** Full width */
  fullWidth?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      validationState = 'default',
      leftIcon,
      rightIcon,
      fullWidth = true,
      required,
      disabled,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    // Generate ID jika tidak ada (menggunakan useId untuk stable ID)
    const generatedId = React.useId();
    const inputId = id || generatedId;

    // Tentukan state berdasarkan error atau validationState
    const state = error ? 'error' : validationState;

    // Base classes
    const baseClasses = 'px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed';

    // State classes
    const stateClasses = {
      default: 'border-neutral-300 focus:ring-neutral-900',
      error: 'border-red-500 focus:ring-red-500',
      success: 'border-green-500 focus:ring-green-500',
    };

    // Width classes
    const widthClasses = fullWidth ? 'w-full' : '';

    // Padding untuk icon
    const paddingClasses = leftIcon ? 'pl-11' : rightIcon ? 'pr-11' : '';

    // Combine classes
    const inputClasses = `${baseClasses} ${stateClasses[state]} ${widthClasses} ${paddingClasses} ${className}`.trim();

    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-neutral-900 mb-2"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Input wrapper untuk icon */}
        <div className="relative">
          {/* Left icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
              {leftIcon}
            </div>
          )}

          {/* Input field */}
          <input
            ref={ref}
            id={inputId}
            className={inputClasses}
            disabled={disabled}
            required={required}
            aria-invalid={state === 'error'}
            aria-describedby={
              error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            {...props}
          />

          {/* Right icon */}
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500">
              {rightIcon}
            </div>
          )}

          {/* Success checkmark */}
          {state === 'success' && !rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-2 text-sm text-red-600"
            role="alert"
          >
            {error}
          </p>
        )}

        {/* Helper text */}
        {helperText && !error && (
          <p
            id={`${inputId}-helper`}
            className="mt-2 text-sm text-neutral-600"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
