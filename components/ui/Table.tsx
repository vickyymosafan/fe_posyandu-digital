import React from 'react';

/**
 * Table Component
 * 
 * Komponen table responsive dengan styling yang konsisten.
 * Mengikuti prinsip Composition Over Inheritance - menggunakan sub-komponen untuk fleksibilitas.
 * Mengikuti prinsip SoC - memisahkan struktur table dari data dan logic.
 */

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  /** Variant visual */
  variant?: 'default' | 'striped' | 'bordered';
  /** Responsive behavior */
  responsive?: boolean;
}

export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  (
    {
      children,
      variant = 'default',
      responsive = true,
      className = '',
      ...props
    },
    ref
  ) => {
    // Base classes
    const baseClasses = 'w-full text-left';

    // Variant classes
    const variantClasses = {
      default: '',
      striped: '[&_tbody_tr:nth-child(odd)]:bg-neutral-50',
      bordered: 'border border-neutral-200',
    };

    // Combine classes
    const tableClasses = `${baseClasses} ${variantClasses[variant]} ${className}`.trim();

    const table = (
      <table ref={ref} className={tableClasses} {...props}>
        {children}
      </table>
    );

    // Wrap dengan responsive container jika responsive
    if (responsive) {
      return (
        <div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0">
          <div className="inline-block min-w-full align-middle">
            {table}
          </div>
        </div>
      );
    }

    return table;
  }
);

Table.displayName = 'Table';

/**
 * TableHead Component
 */
export type TableHeadProps = React.HTMLAttributes<HTMLTableSectionElement>;

export const TableHead = React.forwardRef<HTMLTableSectionElement, TableHeadProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <thead
        ref={ref}
        className={`bg-neutral-100 border-b border-neutral-200 ${className}`.trim()}
        {...props}
      >
        {children}
      </thead>
    );
  }
);

TableHead.displayName = 'TableHead';

/**
 * TableBody Component
 */
export type TableBodyProps = React.HTMLAttributes<HTMLTableSectionElement>;

export const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <tbody ref={ref} className={className} {...props}>
        {children}
      </tbody>
    );
  }
);

TableBody.displayName = 'TableBody';

/**
 * TableRow Component
 */
export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  /** Clickable row */
  clickable?: boolean;
}

export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ children, clickable = false, className = '', ...props }, ref) => {
    const clickableClasses = clickable
      ? 'cursor-pointer hover:bg-neutral-50 transition-colors'
      : '';

    return (
      <tr
        ref={ref}
        className={`border-b border-neutral-200 last:border-b-0 ${clickableClasses} ${className}`.trim()}
        {...props}
      >
        {children}
      </tr>
    );
  }
);

TableRow.displayName = 'TableRow';

/**
 * TableHeader Component (th)
 */
export interface TableHeaderProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  /** Sortable column */
  sortable?: boolean;
  /** Sort direction */
  sortDirection?: 'asc' | 'desc' | null;
  /** Sort handler */
  onSort?: () => void;
}

export const TableHeader = React.forwardRef<HTMLTableCellElement, TableHeaderProps>(
  (
    {
      children,
      sortable = false,
      sortDirection = null,
      onSort,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseClasses = 'px-6 py-4 text-sm font-bold text-neutral-900 uppercase tracking-wider bg-neutral-100';
    const sortableClasses = sortable ? 'cursor-pointer select-none hover:bg-neutral-200' : '';

    return (
      <th
        ref={ref}
        className={`${baseClasses} ${sortableClasses} ${className}`.trim()}
        onClick={sortable ? onSort : undefined}
        {...props}
      >
        <div className="flex items-center gap-2">
          {children}
          {sortable && (
            <span className="text-neutral-500">
              {sortDirection === 'asc' && '↑'}
              {sortDirection === 'desc' && '↓'}
              {sortDirection === null && '↕'}
            </span>
          )}
        </div>
      </th>
    );
  }
);

TableHeader.displayName = 'TableHeader';

/**
 * TableCell Component (td)
 */
export type TableCellProps = React.TdHTMLAttributes<HTMLTableCellElement>;

export const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <td
        ref={ref}
        className={`px-6 py-5 text-base text-neutral-800 ${className}`.trim()}
        {...props}
      >
        {children}
      </td>
    );
  }
);

TableCell.displayName = 'TableCell';

/**
 * TableEmpty Component
 * Komponen untuk menampilkan pesan ketika table kosong
 */
export interface TableEmptyProps {
  /** Pesan kosong */
  message?: string;
  /** Colspan */
  colSpan?: number;
}

export const TableEmpty: React.FC<TableEmptyProps> = ({
  message = 'Tidak ada data',
  colSpan = 1,
}) => {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="text-center py-12">
        <div className="flex flex-col items-center gap-2 text-neutral-500">
          <svg
            className="w-12 h-12"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <p className="text-sm">{message}</p>
        </div>
      </TableCell>
    </TableRow>
  );
};

TableEmpty.displayName = 'TableEmpty';
