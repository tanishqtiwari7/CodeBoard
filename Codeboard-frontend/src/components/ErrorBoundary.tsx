/**
 * ErrorBoundary.tsx - Global error handling component
 * 
 * A React error boundary component that catches JavaScript errors anywhere
 * in the component tree and displays a fallback UI instead of crashing.
 * 
 * Features:
 * - Elegant error display with actionable recovery options
 * - Detailed error information in development mode
 * - Support for custom fallback UI
 * - Error reporting capabilities via optional callback
 * - Integration with theme for consistent styling
 */

import { Component } from "react";
import type { ReactNode } from "react";

// Material UI icons
import ErrorIcon from "@mui/icons-material/Error";
import RefreshIcon from "@mui/icons-material/Refresh";
import HomeIcon from "@mui/icons-material/Home";
import BugReportIcon from "@mui/icons-material/BugReport";

// Types
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  resetKeys?: unknown[];
}

/**
 * Error Boundary Component
 * 
 * Catches JavaScript errors in the component tree and displays
 * a fallback UI instead of crashing the entire application.
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render shows the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Set detailed error info
    this.setState({
      error,
      errorInfo,
    });

    // Call optional error handler for logging/analytics
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log error details in development
    if (import.meta.env.DEV) {
      console.error("Error caught by ErrorBoundary:", error);
      console.error("Component stack:", errorInfo.componentStack);
    }
  }
  
  // Reset the error boundary when resetKeys change
  componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    if (
      this.state.hasError &&
      this.props.resetKeys &&
      prevProps.resetKeys &&
      this.props.resetKeys.length > 0 &&
      this.didResetKeysChange(prevProps.resetKeys, this.props.resetKeys)
    ) {
      this.reset();
    }
  }
  
  // Helper to check if resetKeys changed
  didResetKeysChange(
    prevResetKeys: unknown[] = [],
    resetKeys: unknown[] = []
  ): boolean {
    return (
      resetKeys.length !== prevResetKeys.length ||
      resetKeys.some((key, index) => key !== prevResetKeys[index])
    );
  }
  
  // Handle manual reload
  handleReload = (): void => {
    window.location.reload();
  };

  // Handle navigation to home
  handleGoHome = (): void => {
    window.location.href = "/";
  };

  // Handle manual reset attempt
  handleReset = (): void => {
    this.reset();
  };
  
  // Reset error state
  reset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI with theme-aware styling
      return (
        <div
          style={{
            minHeight: "70vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            background: "var(--background-primary)",
          }}
        >
          <div
            style={{
              background: "var(--background-card)",
              borderRadius: "16px",
              padding: "3rem",
              maxWidth: "650px",
              width: "100%",
              textAlign: "center",
              boxShadow: "var(--shadow-lg)",
              border: "1px solid var(--border-light)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Decorative top border */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "6px",
                background: "var(--error)",
                opacity: 0.9,
              }}
            />

            {/* Error Icon */}
            <div
              style={{
                color: "var(--error)",
                marginBottom: "1.75rem",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <ErrorIcon style={{ fontSize: "4.5rem" }} />
            </div>

            {/* Error Message */}
            <h2
              style={{
                color: "var(--text-primary)",
                marginBottom: "1rem",
                fontSize: "1.8rem",
                fontWeight: 600,
              }}
            >
              Oops! Something went wrong
            </h2>

            <p
              style={{
                color: "var(--text-secondary)",
                marginBottom: "2rem",
                lineHeight: 1.6,
                fontSize: "1.05rem",
                maxWidth: "90%",
                margin: "0 auto 2rem auto",
              }}
            >
              We're sorry, but something unexpected happened. Your data is safe,
              and you can try one of the options below to get back on track.
            </p>

            {/* Error Details (Development Only) */}
            {import.meta.env.DEV && this.state.error && (
              <details
                style={{
                  marginBottom: "2.5rem",
                  textAlign: "left",
                  background: "var(--background-tertiary)",
                  padding: "1.25rem",
                  borderRadius: "8px",
                  fontSize: "0.9rem",
                  border: "1px solid var(--border-light)",
                }}
              >
                <summary
                  style={{
                    cursor: "pointer",
                    fontWeight: 600,
                    marginBottom: "0.75rem",
                    color: "var(--text-primary)",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span>Error Details (Development Only)</span>
                </summary>
                <div style={{ marginTop: "1rem" }}>
                  <h4 style={{ margin: "0 0 0.5rem 0", color: "var(--error)" }}>Error:</h4>
                  <pre
                    style={{
                      whiteSpace: "pre-wrap",
                      color: "var(--text-primary)",
                      margin: "0 0 1rem 0",
                      padding: "0.75rem",
                      background: "var(--background-secondary)",
                      borderRadius: "4px",
                      overflow: "auto",
                      maxHeight: "150px",
                      fontSize: "0.85rem",
                    }}
                  >
                    {this.state.error.toString()}
                  </pre>
                  
                  <h4 style={{ margin: "0 0 0.5rem 0", color: "var(--error)" }}>Stack:</h4>
                  <pre
                    style={{
                      whiteSpace: "pre-wrap",
                      color: "var(--text-primary)",
                      margin: 0,
                      padding: "0.75rem",
                      background: "var(--background-secondary)",
                      borderRadius: "4px",
                      overflow: "auto",
                      maxHeight: "300px",
                      fontSize: "0.85rem",
                    }}
                  >
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </div>
              </details>
            )}

            {/* Action Buttons */}
            <div
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={this.handleReset}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px 24px",
                  background: "var(--primary)",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--primary-dark)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--primary)";
                }}
              >
                <RefreshIcon fontSize="small" />
                Try Again
              </button>

              <button
                onClick={this.handleReload}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px 24px",
                  background: "var(--background-secondary)",
                  color: "var(--text-primary)",
                  border: "1px solid var(--border-light)",
                  borderRadius: "6px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--background-tertiary)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--background-secondary)";
                }}
              >
                <RefreshIcon fontSize="small" />
                Reload Page
              </button>

              <button
                onClick={this.handleGoHome}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px 24px",
                  background: "var(--accent)",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--accent-dark)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--accent)";
                }}
              >
                <HomeIcon fontSize="small" />
                Go Home
              </button>
            </div>

            {/* Help Text */}
            <p
              style={{
                marginTop: "2.5rem",
                fontSize: "0.9rem",
                color: "var(--text-tertiary)",
                lineHeight: 1.5,
              }}
            >
              If this problem persists, please check that your backend server is running on{" "}
              <code
                style={{
                  background: "var(--background-tertiary)",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                localhost:8080
              </code>
              {" "}or refresh your browser cache.
            </p>
          </div>
        </div>
      );
    }

    // No error occurred, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;
