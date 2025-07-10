/**
 * Tag Component
 *
 * A component for displaying tags/labels with optional icons and colors.
 * Used for categorization, filtering, and metadata display.
 */

import React from "react";
import { typography, spacing, borderRadius } from "../../theme/tokens";

// Define variants and sizes
export type TagVariant = "filled" | "outlined" | "soft" | "subtle";
export type TagSize = "small" | "medium" | "large";
export type TagColor =
  | "primary"
  | "secondary"
  | "success"
  | "error"
  | "warning"
  | "info"
  | "neutral";

// Define props interface
interface TagProps {
  label: string;
  variant?: TagVariant;
  size?: TagSize;
  color?: TagColor;
  icon?: React.ReactNode;
  onDelete?: () => void;
  onClick?: () => void;
  className?: string;
  emoji?: string;
  active?: boolean;
}

const Tag: React.FC<TagProps> = ({
  label,
  variant = "soft",
  size = "medium",
  color = "neutral",
  icon,
  onDelete,
  onClick,
  className = "",
  emoji,
  active = false,
}) => {
  // Size variations
  const sizeStyles = {
    small: {
      height: "22px",
      fontSize: typography.fontSize.xs,
      padding: `0 ${spacing["2"]}`,
      borderRadius: borderRadius.sm,
      iconSize: "12px",
    },
    medium: {
      height: "28px",
      fontSize: typography.fontSize.sm,
      padding: `0 ${spacing["3"]}`,
      borderRadius: borderRadius.md,
      iconSize: "16px",
    },
    large: {
      height: "36px",
      fontSize: typography.fontSize.base,
      padding: `0 ${spacing["4"]}`,
      borderRadius: borderRadius.lg,
      iconSize: "20px",
    },
  };

  // Color variations
  const getColorStyles = (
    variant: TagVariant,
    color: TagColor,
    active: boolean
  ) => {
    // Base color variable names
    const colorVars = {
      primary: {
        main: "var(--primary)",
        light: "var(--primary-light)",
        bg: "var(--primary)15",
      },
      secondary: {
        main: "var(--secondary)",
        light: "var(--secondary-light)",
        bg: "var(--secondary)15",
      },
      success: {
        main: "var(--success)",
        light: "var(--success)",
        bg: "var(--success)15",
      },
      error: {
        main: "var(--error)",
        light: "var(--error)",
        bg: "var(--error)15",
      },
      warning: {
        main: "var(--warning)",
        light: "var(--warning)",
        bg: "var(--warning)15",
      },
      info: {
        main: "var(--info)",
        light: "var(--info)",
        bg: "var(--info)15",
      },
      neutral: {
        main: "var(--text)",
        light: "var(--text-secondary)",
        bg: "var(--background-tertiary)",
      },
    };

    // Style variants
    const styles = {
      filled: {
        backgroundColor: active
          ? colorVars[color].main
          : colorVars[color].light,
        color: "white",
        border: "none",
      },
      outlined: {
        backgroundColor: "transparent",
        color: active ? colorVars[color].main : colorVars[color].light,
        border: `1px solid ${
          active ? colorVars[color].main : colorVars[color].light
        }`,
      },
      soft: {
        backgroundColor: active
          ? `${colorVars[color].bg}cc`
          : colorVars[color].bg,
        color: colorVars[color].main,
        border: "none",
      },
      subtle: {
        backgroundColor: "transparent",
        color: colorVars[color].main,
        border: "none",
      },
    };

    return styles[variant];
  };

  // Get color styles based on variant and color props
  const colorStyles = getColorStyles(variant, color, active);

  // Combined styles
  const tagStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing["2"],
    fontWeight: typography.fontWeight.medium,
    height: sizeStyles[size].height,
    fontSize: sizeStyles[size].fontSize,
    padding: sizeStyles[size].padding,
    borderRadius: sizeStyles[size].borderRadius,
    ...colorStyles,
    cursor: onClick ? "pointer" : "default",
    transition: "all 0.2s ease",
    whiteSpace: "nowrap",
    userSelect: "none",
  };

  return (
    <div className={`tag ${className}`} style={tagStyle} onClick={onClick}>
      {icon && (
        <span
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </span>
      )}
      {emoji && <span style={{ marginRight: spacing["1"] }}>{emoji}</span>}
      {label}
      {onDelete && (
        <span
          style={{
            marginLeft: spacing["1"],
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          ×
        </span>
      )}
    </div>
  );
};

export default Tag;
