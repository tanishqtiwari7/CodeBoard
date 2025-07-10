/**
 * Card Component
 *
 * A flexible card component for displaying content with various styles.
 * Supports different elevations, hover effects, and layout options.
 */

import React from "react";
import { spacing, borderRadius, shadows } from "../../theme/tokens";

// Define card props
interface CardProps {
  children: React.ReactNode;
  elevation?: 0 | 1 | 2 | 3 | 4;
  padding?: "none" | "small" | "medium" | "large";
  borderRadius?: "none" | "small" | "medium" | "large";
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
  fullWidth?: boolean;
  style?: React.CSSProperties;
}

const Card: React.FC<CardProps> = ({
  children,
  elevation = 1,
  padding = "medium",
  borderRadius: borderRadiusProp = "medium",
  className = "",
  onClick,
  hoverEffect = false,
  fullWidth = false,
  style = {},
}) => {
  // Map elevation to shadow values
  const shadowMap = {
    0: shadows.none,
    1: shadows.sm,
    2: shadows.DEFAULT,
    3: shadows.md,
    4: shadows.lg,
  };

  // Map padding values
  const paddingMap = {
    none: spacing["0"],
    small: spacing["4"],
    medium: spacing["6"],
    large: spacing["8"],
  };

  // Map border radius values
  const borderRadiusMap = {
    none: borderRadius.none,
    small: borderRadius.md,
    medium: borderRadius.xl,
    large: borderRadius["2xl"],
  };

  // Combine styles
  const cardStyle: React.CSSProperties = {
    display: "block",
    backgroundColor: "var(--card-bg)",
    boxShadow: shadowMap[elevation],
    borderRadius: borderRadiusMap[borderRadiusProp],
    padding: paddingMap[padding],
    transition: "box-shadow 0.2s ease-in-out, transform 0.2s ease-in-out",
    width: fullWidth ? "100%" : "auto",
    cursor: onClick ? "pointer" : "default",
    border: "1px solid var(--border)",
    ...style,
  };

  // Add hover effect if needed
  if (hoverEffect) {
    cardStyle.transform = "translateY(0)";
    cardStyle.boxShadow = shadowMap[elevation];
    // Use CSS-in-JS or styled-components in real implementation for hover effects
  }

  return (
    <div className={`card ${className}`} style={cardStyle} onClick={onClick}>
      {children}
    </div>
  );
};

export default Card;
