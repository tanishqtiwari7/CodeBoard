/**
 * ApiHealthCheck.tsx - Backend connection monitor
 *
 * Monitors and displays the connection status to the backend API.
 * Shows status indicators with appropriate styl          <div
            style={{
           <div
            style={{
              ...base          <div
            style={{
              ...baseStyles,
              background: isDarkMode ? "#1c332a" : "#f0fdf4",
              color: isDarkMode ? "#68d391" : "#2f855a",
              border: `1px solid ${isDarkMode ? "#2f6b4d" : "#c6f6d5"}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "1";
              setVisible(true);
              // Reset auto-hide timer
              if (hideTimeoutRef.current !== undefined) {
                clearTimeout(hideTimeoutRef.current);
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "0.8";
              startAutoHideTimer();
            }}              background: isDarkMode ? "#3b1c1c" : "#fff5f5",
              color: isDarkMode ? "#fc8181" : "#e53e3e",
              border: `1px solid ${isDarkMode ? "#742a2a" : "#fed7d7"}`,
              maxWidth: "350px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "1";
              setVisible(true);
              // Reset auto-hide timer
              if (hideTimeoutRef.current !== undefined) {
                clearTimeout(hideTimeoutRef.current);
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "0.8";
              startAutoHideTimer();
            }}   ...baseStyles,
              background: isDarkMode ? "#2d333b" : "#f0f4f8",
              color: isDarkMode ? "#d0d0d0" : "#555",
              border: `1px solid ${isDarkMode ? "#444" : "#ddd"}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "1";
              setVisible(true);
              // Reset auto-hide timer
              if (hideTimeoutRef.current !== undefined) {
                clearTimeout(hideTimeoutRef.current);
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "0.8";
              startAutoHideTimer();
            }} on connection state.
 */

import React, { useEffect, useState, useRef } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import { useTheme } from "../theme/ThemeContext";
import { useToast } from "./ToastProvider";

// API check status types
type ApiStatus = "checking" | "connected" | "error" | "reconnecting";

// Component props
interface ApiHealthCheckProps {
  hideWhenConnected?: boolean;
  autoReconnect?: boolean;
  reconnectInterval?: number; // milliseconds
  autoHideDelay?: number; // milliseconds to auto-hide notification
}

/**
 * API Health Check Component
 *
 * Monitors and displays connection status to the backend API
 * Shows status indicators and attempts to reconnect when disconnected
 */
const ApiHealthCheck: React.FC<ApiHealthCheckProps> = ({
  hideWhenConnected = false,
  autoReconnect = true,
  reconnectInterval = 10000, // 10 seconds default
  autoHideDelay = 5000, // 5 seconds default
}) => {
  const [status, setStatus] = useState<ApiStatus>("checking");
  const [error, setError] = useState<string>("");
  const [retryCount, setRetryCount] = useState<number>(0);
  const [visible, setVisible] = useState<boolean>(true);
  const hideTimeoutRef = useRef<number | undefined>(undefined);
  const { mode } = useTheme();
  const { showToast } = useToast();
  const isDarkMode = mode === "dark";

  // Check API health
  const checkApiHealth = async (): Promise<boolean> => {
    try {
      // Test basic connectivity with a small request
      const response = await fetch("/api/status", {
        method: "GET",
        headers: { Accept: "application/json" },
        // Short timeout to quickly detect issues
        signal: AbortSignal.timeout(5000),
      });

      if (response.ok) {
        if (status === "error" || status === "reconnecting") {
          showToast(
            "success",
            "Successfully reconnected to the backend API.",
            5000
          );
        }

        setStatus("connected");
        setError("");
        return true;
      } else {
        const errorText = `API Error: HTTP ${response.status} - ${response.statusText}`;
        setStatus("error");
        setError(errorText);
        return false;
      }
    } catch (err) {
      // Handle common connection errors more gracefully
      const isConnRefused =
        err instanceof Error &&
        (err.message.includes("Failed to fetch") ||
          err.message.includes("ECONNREFUSED") ||
          err.message.includes("Network Error"));

      const errorMessage = isConnRefused
        ? "Backend server is not running or unreachable"
        : err instanceof Error
          ? err.message
          : "Unknown connection error";

      setStatus("error");
      setError(errorMessage);
      return false;
    }
  };

  // Handle reconnection attempts
  useEffect(() => {
    let reconnectTimer: number | undefined;

    if (status === "error" && autoReconnect) {
      setStatus("reconnecting");
      reconnectTimer = window.setTimeout(async () => {
        setRetryCount((prev) => prev + 1);
        await checkApiHealth();
      }, reconnectInterval);
    }

    return () => {
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
      }
    };
  }, [status, autoReconnect, reconnectInterval]);

  // Reset visibility and set up auto-hide
  const startAutoHideTimer = () => {
    // Clear any existing timeout
    if (hideTimeoutRef.current !== undefined) {
      window.clearTimeout(hideTimeoutRef.current);
    }

    // Make notification visible
    setVisible(true);

    // Start auto-hide timer if we're connected
    if (status === "connected") {
      hideTimeoutRef.current = window.setTimeout(() => {
        setVisible(false);
      }, autoHideDelay);
    }
  };

  // Initial check on component mount
  useEffect(() => {
    checkApiHealth();

    // Set up periodic health checks
    const intervalId = setInterval(() => {
      if (status === "connected") {
        checkApiHealth();
      }
    }, 60000); // Check every minute if connected

    return () => {
      clearInterval(intervalId);
      if (hideTimeoutRef.current !== undefined) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  // Run auto-hide timer when status changes
  useEffect(() => {
    startAutoHideTimer();
    // Don't auto-hide if there's an error or we're reconnecting
    if (status === "error" || status === "reconnecting") {
      setVisible(true);
      if (hideTimeoutRef.current !== undefined) {
        window.clearTimeout(hideTimeoutRef.current);
      }
    }
  }, [status, autoHideDelay]);

  // Helper to get appropriate UI based on status
  const getStatusUI = () => {
    // If not visible and we're connected, don't render anything
    if (!visible && status === "connected") {
      return null;
    }

    // Base styles
    const baseStyles = {
      position: "fixed" as const,
      bottom: "16px",
      right: "16px",
      padding: "6px 10px",
      borderRadius: "20px",
      fontSize: "12px",
      fontWeight: 500,
      zIndex: 9999,
      display: "flex",
      alignItems: "center",
      gap: "6px",
      boxShadow: isDarkMode
        ? "0 2px 8px rgba(0, 0, 0, 0.5)"
        : "0 2px 8px rgba(0, 0, 0, 0.1)",
      opacity: visible ? 0.8 : 0,
      transition: "opacity 0.3s ease",
      animation: status === "reconnecting" ? "pulse 2s infinite" : "none",
      pointerEvents: visible ? "auto" : ("none" as "auto" | "none"),
    };

    switch (status) {
      case "checking":
        return (
          <div
            style={{
              ...baseStyles,
              background: isDarkMode ? "#2d333b" : "#f0f4f8",
              color: isDarkMode ? "#d0d0d0" : "#555",
              border: `1px solid ${isDarkMode ? "#444" : "#ddd"}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "1";
              setVisible(true);
              // Reset auto-hide timer when hovering
              if (hideTimeoutRef.current !== undefined) {
                window.clearTimeout(hideTimeoutRef.current);
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "0.8";
              startAutoHideTimer();
            }}
          >
            <CircularProgress
              size={16}
              thickness={5}
              style={{ color: isDarkMode ? "#90cdf4" : "#3182ce" }}
            />
            Checking API...
          </div>
        );

      case "error":
        return (
          <div
            style={{
              ...baseStyles,
              background: isDarkMode ? "#3b1c1c" : "#fff5f5",
              color: isDarkMode ? "#fc8181" : "#e53e3e",
              border: `1px solid ${isDarkMode ? "#742a2a" : "#fed7d7"}`,
              maxWidth: "350px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "1";
              setVisible(true);
              // Reset auto-hide timer when hovering
              if (hideTimeoutRef.current !== undefined) {
                window.clearTimeout(hideTimeoutRef.current);
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "0.8";
              startAutoHideTimer();
            }}
          >
            <ErrorIcon fontSize="small" />
            {error}
          </div>
        );

      case "reconnecting":
        return (
          <div
            style={{
              ...baseStyles,
              background: isDarkMode ? "#2b3240" : "#fef6e4",
              color: isDarkMode ? "#fbd38d" : "#dd6b20",
              border: `1px solid ${isDarkMode ? "#553c10" : "#fdecc8"}`,
            }}
          >
            <CircularProgress
              size={16}
              thickness={5}
              style={{ color: isDarkMode ? "#fbd38d" : "#dd6b20" }}
            />
            Reconnecting... (Attempt {retryCount})
          </div>
        );

      case "connected":
        if (hideWhenConnected || !visible) {
          return null;
        }
        return (
          <div
            style={{
              ...baseStyles,
              background: isDarkMode ? "#1c332a" : "#f0fdf4",
              color: isDarkMode ? "#68d391" : "#2f855a",
              border: `1px solid ${isDarkMode ? "#2f6b4d" : "#c6f6d5"}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "1";
              setVisible(true);
              // Reset auto-hide timer when hovering
              if (hideTimeoutRef.current !== undefined) {
                window.clearTimeout(hideTimeoutRef.current);
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "0.8";
              startAutoHideTimer();
            }}
          >
            <CheckCircleIcon fontSize="small" />
            API Connected
          </div>
        );
    }
  };

  return getStatusUI();
};

export default ApiHealthCheck;
