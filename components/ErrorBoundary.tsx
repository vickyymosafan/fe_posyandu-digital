'use client';

/**
 * Error Boundary Component
 *
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI.
 *
 * Use this to wrap components that might throw errors and need
 * graceful error handling with detailed error information.
 */

import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log error details
    console.error('❌ [ErrorBoundary] Caught an error!');
    console.error('❌ [ErrorBoundary] Error:', error);
    console.error('❌ [ErrorBoundary] Error message:', error.message);
    console.error('❌ [ErrorBoundary] Error stack:', error.stack);
    console.error('❌ [ErrorBoundary] Component stack:', errorInfo.componentStack);

    // Update state with error info
    this.setState({
      errorInfo,
    });
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI with error details
      return (
        <div className="min-h-screen bg-red-50 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white border-2 border-red-500 rounded-lg p-8 shadow-lg">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0">
                  <svg
                    className="w-12 h-12 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-red-900 mb-2">
                    ❌ Application Error
                  </h1>
                  <p className="text-red-700 mb-4">
                    Terjadi kesalahan saat memuat aplikasi. Silakan periksa console untuk detail lengkap.
                  </p>
                </div>
              </div>

              {/* Error Details */}
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold text-neutral-900 mb-2">
                    Error Message:
                  </h2>
                  <div className="bg-red-100 border border-red-300 rounded p-4">
                    <code className="text-red-900 text-sm break-all">
                      {this.state.error?.message || 'Unknown error'}
                    </code>
                  </div>
                </div>

                {this.state.error?.stack && (
                  <div>
                    <h2 className="text-lg font-semibold text-neutral-900 mb-2">
                      Stack Trace:
                    </h2>
                    <div className="bg-neutral-100 border border-neutral-300 rounded p-4 overflow-x-auto">
                      <pre className="text-xs text-neutral-800 whitespace-pre-wrap">
                        {this.state.error.stack}
                      </pre>
                    </div>
                  </div>
                )}

                {this.state.errorInfo?.componentStack && (
                  <div>
                    <h2 className="text-lg font-semibold text-neutral-900 mb-2">
                      Component Stack:
                    </h2>
                    <div className="bg-neutral-100 border border-neutral-300 rounded p-4 overflow-x-auto">
                      <pre className="text-xs text-neutral-800 whitespace-pre-wrap">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="mt-6 flex gap-4">
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Reload Page
                </button>
                <button
                  onClick={() => {
                    this.setState({ hasError: false, error: null, errorInfo: null });
                  }}
                  className="px-6 py-2 bg-neutral-600 text-white rounded-lg hover:bg-neutral-700 transition-colors font-medium"
                >
                  Try Again
                </button>
              </div>

              {/* Instructions */}
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-sm text-yellow-900">
                  <strong>💡 Untuk Developer:</strong> Buka browser console (F12) untuk melihat error logs lengkap.
                  Error telah di-log dengan prefix ❌ [ErrorBoundary].
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
