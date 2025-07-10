/**
 * TextField Component
 *
 * A flexible text input component with various styling options and states.
 * Supports labels, error states, icons, and more.
 */

import React from "react";
import {
  spacing,
  typography,
  borderRadius,
  transitions,
} from "../../theme/tokens";

// Define props interface
interface TextFieldProps {
  id?: string;
  name?: string;
  label?: string;
  type?: "text" | "email" | "password" | "number" | "search" | "tel" | "url";
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  error?: string;
  helperText?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  fullWidth?: boolean;
  autoFocus?: boolean;
  className?: string;
  size?: "small" | "medium" | "large";
  variant?: "outlined" | "filled" | "standard";
  inputRef?: React.Ref<HTMLInputElement>;
}

const TextField: React.FC<TextFieldProps> = ({
  id,
  name,
  label,
  type = "text",
  placeholder,
  value,
  defaultValue,
  onChange,
  onBlur,
  onFocus,
  disabled = false,
  readOnly = false,
  required = false,
  error,
  helperText,
  startIcon,
  endIcon,
  fullWidth = false,
  autoFocus = false,
  className = "",
  size = "medium",
  variant = "outlined",
  inputRef,
}) => {
  // Generate a unique ID if not provided
  const inputId =
    id || `textfield-${Math.random().toString(36).substring(2, 9)}`;

  // Size variations
  const sizeStyles = {
    small: {
      padding: `${spacing["1"]} ${spacing["2"]}`,
      fontSize: typography.fontSize.sm,
      height: "32px",
    },
    medium: {
      padding: `${spacing["2"]} ${spacing["3"]}`,
      fontSize: typography.fontSize.base,
      height: "40px",
    },
    large: {
      padding: `${spacing["3"]} ${spacing["4"]}`,
      fontSize: typography.fontSize.lg,
      height: "48px",
    },
  };

  // Container style
  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    width: fullWidth ? "100%" : "auto",
    marginBottom: helperText || error ? spacing["4"] : spacing["2"],
  };

  // Label style
  const labelStyle: React.CSSProperties = {
    color: error ? "var(--error)" : "var(--text-secondary)",
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    marginBottom: spacing["1"],
    cursor: disabled ? "not-allowed" : "default",
  };

  // Wrapper style for the input (includes icons)
  const wrapperStyle: React.CSSProperties = {
    position: "relative",
    display: "flex",
    alignItems: "center",
    width: "100%",
  };

  // Base input style
  const baseInputStyle: React.CSSProperties = {
    boxSizing: "border-box",
    width: "100%",
    border: error
      ? "1px solid var(--error)"
      : variant === "standard"
      ? "none"
      : "1px solid var(--border)",
    borderRadius: variant === "standard" ? 0 : borderRadius.md,
    backgroundColor:
      variant === "filled" ? "var(--background-tertiary)" : "var(--card-bg)",
    color: "var(--text)",
    transition: `all ${transitions.duration.normal} ${transitions.timing.easeInOut}`,
    fontFamily: typography.fontFamily.primary,
    outline: "none",
    ...sizeStyles[size],
    paddingLeft: startIcon ? spacing["8"] : sizeStyles[size].padding,
    paddingRight: endIcon ? spacing["8"] : sizeStyles[size].padding,
  };

  // Additional styles for standard variant (with bottom border)
  const standardStyle: React.CSSProperties =
    variant === "standard"
      ? {
          borderBottom: error
            ? "1px solid var(--error)"
            : "1px solid var(--border)",
          paddingLeft: startIcon ? spacing["6"] : spacing["1"],
          paddingRight: endIcon ? spacing["6"] : spacing["1"],
        }
      : {};

  // Combine all input styles
  const inputStyle: React.CSSProperties = {
    ...baseInputStyle,
    ...standardStyle,
    opacity: disabled ? 0.7 : 1,
    cursor: disabled ? "not-allowed" : readOnly ? "default" : "text",
  };

  // Icon styles
  const iconStyle: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    color: error ? "var(--error)" : "var(--text-secondary)",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  // Helper text style
  const helperTextStyle: React.CSSProperties = {
    fontSize: typography.fontSize.xs,
    color: error ? "var(--error)" : "var(--text-secondary)",
    marginTop: spacing["1"],
  };

  return (
    <div style={containerStyle} className={className}>
      {label && (
        <label htmlFor={inputId} style={labelStyle}>
          {label}
          {required && <span style={{ color: "var(--error)" }}> *</span>}
        </label>
      )}

      <div style={wrapperStyle}>
        {startIcon && (
          <div
            style={{
              ...iconStyle,
              left: variant === "standard" ? 0 : spacing["2"],
            }}
          >
            {startIcon}
          </div>
        )}

        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          defaultValue={defaultValue}
          placeholder={placeholder}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          autoFocus={autoFocus}
          style={inputStyle}
          ref={inputRef}
        />

        {endIcon && (
          <div
            style={{
              ...iconStyle,
              right: variant === "standard" ? 0 : spacing["2"],
            }}
          >
            {endIcon}
          </div>
        )}
      </div>

      {(helperText || error) && (
        <span style={helperTextStyle}>{error || helperText}</span>
      )}
    </div>
  );
};

export default TextField;
