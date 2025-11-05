'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';

/**
 * Notification System
 * 
 * Sistem notifikasi global dengan auto-dismiss dan positioning.
 * Mengikuti prinsip DIP (Dependency Inversion Principle) - komponen tingkat tinggi bergantung pada abstraksi (context).
 * Mengikuti prinsip SoC - memisahkan state management (context) dari presentasi (component).
 */

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}

interface NotificationContextValue {
  notifications: Notification[];
  showNotification: (type: NotificationType, message: string, duration?: number) => void;
  hideNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

/**
 * NotificationProvider Component
 * Provider untuk notification context
 */
export interface NotificationProviderProps {
  children: React.ReactNode;
  /** Posisi notifikasi */
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  /** Default duration (ms) */
  defaultDuration?: number;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
  position = 'top-right',
  defaultDuration = 5000,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [mounted, setMounted] = useState(false);

  // Only render portal after client-side hydration to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const hideNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const showNotification = useCallback(
    (type: NotificationType, message: string, duration: number = defaultDuration) => {
      const id = `notification-${Date.now()}-${Math.random()}`;
      const notification: Notification = { id, type, message, duration };

      setNotifications((prev) => [...prev, notification]);

      // Auto dismiss
      if (duration > 0) {
        setTimeout(() => {
          hideNotification(id);
        }, duration);
      }
    },
    [defaultDuration, hideNotification]
  );

  // Position classes
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  };

  return (
    <NotificationContext.Provider value={{ notifications, showNotification, hideNotification }}>
      {children}
      {mounted && notifications.length > 0 &&
        createPortal(
          <div className={`fixed ${positionClasses[position]} z-50 flex flex-col gap-2 max-w-sm w-full`}>
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onClose={() => hideNotification(notification.id)}
              />
            ))}
          </div>,
          document.body
        )}
    </NotificationContext.Provider>
  );
};

/**
 * useNotification Hook
 * Hook untuk menggunakan notification context
 */
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification harus digunakan di dalam NotificationProvider');
  }
  return context;
};

/**
 * NotificationItem Component
 * Komponen individual notification
 */
interface NotificationItemProps {
  notification: Notification;
  onClose: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);

  // Handle close dengan animasi
  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 300); // Durasi animasi
  };

  // Type config
  const typeConfig = {
    success: {
      bgColor: 'bg-green-50',
      borderColor: 'border-green-500',
      textColor: 'text-green-900',
      iconColor: 'text-green-500',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
    },
    error: {
      bgColor: 'bg-red-50',
      borderColor: 'border-red-500',
      textColor: 'text-red-900',
      iconColor: 'text-red-500',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
    },
    warning: {
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-500',
      textColor: 'text-yellow-900',
      iconColor: 'text-yellow-500',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      ),
    },
    info: {
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-500',
      textColor: 'text-blue-900',
      iconColor: 'text-blue-500',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  };

  const config = typeConfig[notification.type];

  return (
    <div
      className={`
        ${config.bgColor} ${config.borderColor} ${config.textColor}
        border-l-4 rounded-xl shadow-lg p-4 flex items-start gap-3
        transition-all duration-300
        ${isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'}
      `}
      role="alert"
    >
      {/* Icon */}
      <div className={`flex-shrink-0 ${config.iconColor}`}>
        {config.icon}
      </div>

      {/* Message */}
      <div className="flex-1 text-sm font-medium">
        {notification.message}
      </div>

      {/* Close button */}
      <button
        onClick={handleClose}
        className={`flex-shrink-0 ${config.iconColor} hover:opacity-70 transition-opacity`}
        aria-label="Tutup notifikasi"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};
