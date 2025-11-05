import React from 'react';

/**
 * Card Component
 * 
 * Komponen card sederhana untuk menampilkan konten dalam container dengan shadow dan rounded corners.
 * Mengikuti prinsip KISS (Keep It Simple, Stupid) - implementasi yang sederhana dan mudah digunakan.
 * Mengikuti prinsip Composition Over Inheritance - menggunakan children untuk fleksibilitas.
 */

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Varian visual card */
  variant?: 'default' | 'bordered' | 'elevated';
  /** Padding size */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Hover effect */
  hoverable?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      variant = 'default',
      padding = 'md',
      hoverable = false,
      className = '',
      ...props
    },
    ref
  ) => {
    // Base classes
    const baseClasses = 'bg-white rounded-2xl transition-all duration-300';

    // Variant classes
    const variantClasses = {
      default: 'shadow-sm',
      bordered: 'border border-neutral-200',
      elevated: 'shadow-lg',
    };

    // Padding classes
    const paddingClasses = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    // Hover classes
    const hoverClasses = hoverable ? 'hover:shadow-md hover:-translate-y-1 cursor-pointer' : '';

    // Combine classes
    const cardClasses = `${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${hoverClasses} ${className}`.trim();

    return (
      <div ref={ref} className={cardClasses} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

/**
 * CardHeader Component
 * Sub-komponen untuk header card
 */
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Title */
  title?: string;
  /** Subtitle */
  subtitle?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  subtitle,
  children,
  className = '',
  ...props
}) => {
  return (
    <div className={`mb-4 ${className}`.trim()} {...props}>
      {title && <h3 className="text-xl font-semibold text-neutral-900">{title}</h3>}
      {subtitle && <p className="text-sm text-neutral-600 mt-1">{subtitle}</p>}
      {children}
    </div>
  );
};

CardHeader.displayName = 'CardHeader';

/**
 * CardBody Component
 * Sub-komponen untuk body card
 */
export type CardBodyProps = React.HTMLAttributes<HTMLDivElement>;

export const CardBody: React.FC<CardBodyProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
};

CardBody.displayName = 'CardBody';

/**
 * CardFooter Component
 * Sub-komponen untuk footer card
 */
export type CardFooterProps = React.HTMLAttributes<HTMLDivElement>;

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div className={`mt-4 pt-4 border-t border-neutral-200 ${className}`.trim()} {...props}>
      {children}
    </div>
  );
};

CardFooter.displayName = 'CardFooter';
