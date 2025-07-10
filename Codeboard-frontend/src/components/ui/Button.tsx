/**
 * Button Component
 *
 * A versatile button component with various styles and variants.
 * Supports primary, secondary, outline, text, and more styles.
 */

import React from "react";
import {
  typography,
  spacing,
  borderRadius,
  transitions,
} from "../../theme/tokens";

// Define button variants and sizes as types
export type ButtonVariant =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "light"
  | "dark"
  | "link";
export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";
export type ButtonAppearance = "solid" | "outline" | "ghost" | "text";

// Define props interface
interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  appearance?: ButtonAppearance;
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  ariaLabel?: string;
  href?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  appearance = "solid",
  fullWidth = false,
  disabled = false,
  loading = false,
  icon,
  iconPosition = "left",
  onClick,
  type = "button",
  className = "",
  ariaLabel,
  href,
}) => {
  // Generate size styles
  const sizeStyles = {
    xs: {
      padding: `${spacing["1"]} ${spacing["2"]}`,
      fontSize: typography.fontSize.xs,
      borderRadius: borderRadius.md,
    },
    sm: {
      padding: `${spacing["2"]} ${spacing["3"]}`,
      fontSize: typography.fontSize.sm,
      borderRadius: borderRadius.md,
    },
    md: {
      padding: `${spacing["2"]} ${spacing["4"]}`,
      fontSize: typography.fontSize.base,
      borderRadius: borderRadius.lg,
    },
    lg: {
      padding: `${spacing["3"]} ${spacing["5"]}`,
      fontSize: typography.fontSize.lg,
      borderRadius: borderRadius.lg,
    },
    xl: {
      padding: `${spacing["4"]} ${spacing["6"]}`,
      fontSize: typography.fontSize.xl,
      borderRadius: borderRadius.xl,
    },
  };

  // Generate style for button based on variant and appearance
  const getButtonStyles = (): Record<string, any> => {
    // Base styles for all buttons
    const baseStyle = {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: spacing["2"],
      fontWeight: typography.fontWeight.medium,
      transition: `all ${transitions.duration.normal} ${transitions.timing.easeInOut}`,
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.6 : 1,
      width: fullWidth ? "100%" : "auto",
      ...sizeStyles[size],
    };

    // Style variations based on appearance prop
    const styleVariants = {
      solid: {
        background: `var(--${
          variant === "primary"
            ? "primary"
            : variant === "secondary"
            ? "secondary"
            : variant
        })`,
        color: "white",
        border: "none",
        "&:hover": {
          filter: "brightness(110%)",
        },
        "&:active": {
          filter: "brightness(90%)",
        },
      },
      outline: {
        background: "transparent",
        color: `var(--${
          variant === "primary"
            ? "primary"
            : variant === "secondary"
            ? "secondary"
            : variant
        })`,
        border: `1px solid var(--${
          variant === "primary"
            ? "primary"
            : variant === "secondary"
            ? "secondary"
            : variant
        })`,
        "&:hover": {
          background: `var(--${
            variant === "primary"
              ? "primary"
              : variant === "secondary"
              ? "secondary"
              : variant
          }-light)`,
          color: "var(--white)",
        },
      },
      ghost: {
        background: "transparent",
        color: `var(--${
          variant === "primary"
            ? "primary"
            : variant === "secondary"
            ? "secondary"
            : variant
        })`,
        border: "none",
        "&:hover": {
          background: `var(--${
            variant === "primary"
              ? "primary"
              : variant === "secondary"
              ? "secondary"
              : variant
          }15)`,
        },
      },
      text: {
        background: "transparent",
        color: `var(--${
          variant === "primary"
            ? "primary"
            : variant === "secondary"
            ? "secondary"
            : variant
        })`,
        border: "none",
        padding: "0",
        "&:hover": {
          textDecoration: "underline",
        },
      },
    };

    return {
      ...baseStyle,
      ...styleVariants[appearance],
    };
  };

  // Build the style for the button
  const buttonStyleObj: Record<string, any> = getButtonStyles();

  // Use CSS-in-JS or styled components in a real project
  // This is a simplified version using inline styles
  const buttonStyle: Record<string, any> = {
    display: buttonStyleObj.display,
    alignItems: buttonStyleObj.alignItems,
    justifyContent: buttonStyleObj.justifyContent,
    gap: buttonStyleObj.gap,
    fontWeight: buttonStyleObj.fontWeight,
    transition: buttonStyleObj.transition,
    cursor: buttonStyleObj.cursor,
    opacity: buttonStyleObj.opacity,
    width: buttonStyleObj.width,
    padding: sizeStyles[size].padding,
    fontSize: sizeStyles[size].fontSize,
    borderRadius: sizeStyles[size].borderRadius,
    background: buttonStyleObj.background,
    color: buttonStyleObj.color,
    border: buttonStyleObj.border,
    textDecoration: "none",
  };

  // If href is provided, render an anchor tag
  if (href) {
    return (
      <a
        href={href}
        className={className}
        style={buttonStyle as React.CSSProperties}
        aria-label={ariaLabel}
      >
        {iconPosition === "left" && icon}
        {loading ? (
          <span
            className="loading-spinner"
            style={{ marginRight: icon ? spacing["2"] : 0 }}
          >
            ●
          </span>
        ) : null}
        {children}
        {iconPosition === "right" && icon}
      </a>
    );
  }

  // Otherwise render a button
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={className}
      style={buttonStyle as React.CSSProperties}
      aria-label={ariaLabel}
    >
      {iconPosition === "left" && icon}
      {loading ? (
        <span
          className="loading-spinner"
          style={{ marginRight: icon ? spacing["2"] : 0 }}
        >
          ●
        </span>
      ) : null}
      {children}
      {iconPosition === "right" && icon}
    </button>
  );
};

export default Button;
