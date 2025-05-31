// components/error-boundary.tsx
'use client';

import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Don't log redirect errors as they're expected
    if (error.message !== 'NEXT_REDIRECT') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError && this.state.error) {
      // Check if it's a redirect error - if so, don't show error UI
      if (this.state.error.message === 'NEXT_REDIRECT') {
        return null; // Let the redirect happen
      }

      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return (
        <FallbackComponent 
          error={this.state.error} 
          reset={() => this.setState({ hasError: false, error: null })} 
        />
      );
    }

    return this.props.children;
  }
}

const DefaultErrorFallback: React.FC<{ error: Error; reset: () => void }> = ({ error, reset }) => {
  return (
    <div className="flex flex-col max-w-4xl mx-auto pb-20">
      <div className="p-4 w-full">
        <h1 className="text-2xl font-semibold text-red-600">
          Algo salió mal
        </h1>
        <p className="mt-4 text-gray-600">
          Ha ocurrido un error inesperado. Por favor, intenta nuevamente.
        </p>
        <button 
          onClick={reset}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Intentar nuevamente
        </button>
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-4">
            <summary className="cursor-pointer text-sm text-gray-500">
              Detalles del error (solo en desarrollo)
            </summary>
            <pre className="mt-2 p-4 bg-gray-100 text-sm overflow-auto rounded">
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
};

export default ErrorBoundary;