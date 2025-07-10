/**
 * LoadingSpinner Component
 *
 * Enhanced loading indicator with customizable appearance and behavior.
 * Used for indicating loading states across the application.
 */

import React from "react";
import { spacing, typography } from "../../theme/tokens";

// Define props interface
interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  message?: string;
  fullPage?: boolean;
  color?: "primary" | "secondary" | "accent" | "light";
  type?: "spinner" | "dots" | "pulse";
}

/**
 * Enhanced Loading Spinner Component
 *
 * Provides various loading indicators with:
 * - Customizable sizes and colors
 * - Optional loading messages
 * - Full page overlay option
 * - Multiple animation types
 * - Smooth transitions
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "medium",
  message = "Loading...",
  fullPage = false,
  color = "primary",
  type = "spinner",
}) => {
  // Size mapping for different spinner sizes
  const sizeMap = {
    small: 24,
    medium: 40,
    large: 60,
  };

  // Color mapping for different spinner colors
  const colorMap = {
    primary: "var(--primary)",
    secondary: "var(--secondary)",
    accent: "var(--accent)",
    light: "var(--text-light)",
  };

  // Container styles for the spinner
  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing["4"],
    padding: spacing["6"],
    ...(fullPage && {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      backdropFilter: "blur(4px)",
      zIndex: 9999,
    }),
  };

  // Render different spinner types
  const renderSpinner = () => {
    switch (type) {
      case "dots":
        return (
          <div
            style={{
              display: "flex",
              gap: spacing["2"],
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  width: sizeMap[size] / 4,
                  height: sizeMap[size] / 4,
                  backgroundColor: colorMap[color],
                  borderRadius: "50%",
                  animation: `loadingDot ${
                    i * 0.2 + 0.8
                  }s infinite ease-in-out alternate`,
                }}
              />
            ))}
          </div>
        );

      case "pulse":
        return (
          <div
            style={{
              width: sizeMap[size],
              height: sizeMap[size],
              backgroundColor: colorMap[color],
              borderRadius: "50%",
              animation: "pulse 1.5s infinite ease-in-out",
              opacity: 0.6,
            }}
          />
        );

      case "spinner":
      default:
        return (
          <div
            style={{
              position: "relative",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Outer rotating ring */}
            <div
              style={{
                width: sizeMap[size] + 16,
                height: sizeMap[size] + 16,
                border: "3px solid var(--background-tertiary)",
                borderTopColor: colorMap[color],
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                position: "absolute",
              }}
            />

            {/* Inner pulsing circle */}
            <div
              style={{
                width: sizeMap[size] - 10,
                height: sizeMap[size] - 10,
                background: `linear-gradient(135deg, ${colorMap[color]}80, ${colorMap[color]}20)`,
                borderRadius: "50%",
                animation: "pulse 2s ease-in-out infinite",
                opacity: 0.3,
              }}
            />
          </div>
        );
    }
  };

  return (
    <div style={containerStyle} role="status" aria-live="polite">
      {renderSpinner()}

      {message && (
        <p
          style={{
            margin: 0,
            color: "var(--text)",
            fontSize: typography.fontSize.sm,
            fontWeight: typography.fontWeight.medium,
            textAlign: "center",
            animation: "fadeInOut 2s ease-in-out infinite",
          }}
        >
          {message}
        </p>
      )}

      {/* CSS animations */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @keyframes pulse {
            0%, 100% { transform: scale(0.8); opacity: 0.3; }
            50% { transform: scale(1.2); opacity: 0.1; }
          }
          
          @keyframes fadeInOut {
            0%, 100% { opacity: 0.7; }
            50% { opacity: 1; }
          }
          
          @keyframes loadingDot {
            0% { transform: translateY(0); opacity: 0.3; }
            100% { transform: translateY(-10px); opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

export default LoadingSpinner;
