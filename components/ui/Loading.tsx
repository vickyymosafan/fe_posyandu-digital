import React from 'react';

/**
 * Loading Component
 * 
 * Komponen loading dengan berbagai varian (spinner, skeleton, dots).
 * Mengikuti prinsip SRP - hanya bertanggung jawab untuk menampilkan loading state.
 */

export interface LoadingProps {
  /** Varian loading */
  variant?: 'spinner' | 'skeleton' | 'dots';
  /** Ukuran */
  size?: 'sm' | 'md' | 'lg';
  /** Text loading (opsional) */
  text?: string;
  /** Full screen overlay */
  fullScreen?: boolean;
}

// Size classes
const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

// Spinner component
const Spinner: React.FC<{ size: 'sm' | 'md' | 'lg' }> = ({ size }) => (
  <svg
    className={`animate-spin ${sizeClasses[size]} text-neutral-900`}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    aria-label="Loading"
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
);

// Dots component
const Dots: React.FC<{ size: 'sm' | 'md' | 'lg' }> = ({ size }) => (
  <div className="flex space-x-2">
    <div className={`${sizeClasses[size]} bg-neutral-900 rounded-full animate-bounce`} style={{ animationDelay: '0ms' }} />
    <div className={`${sizeClasses[size]} bg-neutral-900 rounded-full animate-bounce`} style={{ animationDelay: '150ms' }} />
    <div className={`${sizeClasses[size]} bg-neutral-900 rounded-full animate-bounce`} style={{ animationDelay: '300ms' }} />
  </div>
);

export const Loading: React.FC<LoadingProps> = ({
  variant = 'spinner',
  size = 'md',
  text,
  fullScreen = false,
}) => {
  // Content
  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      {variant === 'spinner' && <Spinner size={size} />}
      {variant === 'dots' && <Dots size={size} />}
      {text && <p className="text-sm text-neutral-600">{text}</p>}
    </div>
  );

  // Full screen overlay
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return content;
};

Loading.displayName = 'Loading';

/**
 * Skeleton Component
 * Komponen skeleton untuk loading state dengan placeholder
 */
export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Varian skeleton */
  variant?: 'text' | 'circular' | 'rectangular';
  /** Width */
  width?: string | number;
  /** Height */
  height?: string | number;
  /** Number of lines (untuk text variant) */
  lines?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  lines = 1,
  className = '',
  style,
  ...props
}) => {
  // Base classes
  const baseClasses = 'animate-pulse bg-neutral-200';

  // Variant classes
  const variantClasses = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-xl',
  };

  // Style object
  const skeletonStyle: React.CSSProperties = {
    width: width || (variant === 'text' ? '100%' : undefined),
    height: height || (variant === 'circular' ? width : undefined),
    ...style,
  };

  // Jika text dengan multiple lines
  if (variant === 'text' && lines > 1) {
    return (
      <div className="space-y-2" {...props}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`${baseClasses} ${variantClasses[variant]} ${className}`.trim()}
            style={{
              ...skeletonStyle,
              width: index === lines - 1 ? '80%' : '100%',
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`.trim()}
      style={skeletonStyle}
      {...props}
    />
  );
};

Skeleton.displayName = 'Skeleton';
