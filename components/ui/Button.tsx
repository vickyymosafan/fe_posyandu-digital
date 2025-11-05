import React from 'react';

/**
 * Button Component
 * 
 * Komponen tombol yang dapat digunakan kembali dengan berbagai varian dan ukuran.
 * Mengikuti prinsip SRP (Single Responsibility Principle) - hanya bertanggung jawab untuk rendering tombol.
 * Mengikuti prinsip OCP (Open/Closed Principle) - dapat diperluas melalui props tanpa mengubah kode internal.
 */

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Varian visual tombol */
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  /** Ukuran tombol */
  size?: 'sm' | 'md' | 'lg';
  /** Status loading */
  isLoading?: boolean;
  /** Icon di sebelah kiri */
  leftIcon?: React.ReactNode;
  /** Icon di sebelah kanan */
  rightIcon?: React.ReactNode;
  /** Full width */
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      className = '',
      ...props
    },
    ref
  ) => {
    // Base classes untuk semua tombol
    const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-300 focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    // Variant classes
    const variantClasses = {
      primary: 'bg-neutral-900 text-white hover:bg-neutral-800 focus-visible:ring-neutral-900',
      secondary: 'bg-neutral-200 text-neutral-900 hover:bg-neutral-300 focus-visible:ring-neutral-400',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600',
      ghost: 'bg-transparent text-neutral-900 hover:bg-neutral-100 focus-visible:ring-neutral-400',
    };

    // Size classes
    const sizeClasses = {
      sm: 'min-h-[36px] min-w-[36px] px-4 py-2 text-sm rounded-lg',
      md: 'min-h-[44px] min-w-[44px] px-6 py-3 text-base rounded-xl',
      lg: 'min-h-[52px] min-w-[52px] px-8 py-4 text-lg rounded-xl',
    };

    // Width classes
    const widthClasses = fullWidth ? 'w-full' : '';

    // Combine all classes
    const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClasses} ${className}`.trim();

    return (
      <button
        ref={ref}
        className={buttonClasses}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
