/**
 * Design System Tokens
 *
 * This file defines all the design tokens (colors, typography, spacing, etc.)
 * that are used throughout the application. All UI customization should start here.
 */

// Color tokens - Organized by purpose with semantic naming
export const colors = {
  // Brand colors
  brand: {
    primary: "#2d5a87",
    primaryLight: "#4a90a4",
    primaryDark: "#1e3a5f",
    secondary: "#4a90a4",
    accent: "#fba257",
    accentLight: "#ffc470",
    accentDark: "#e8934a",
  },

  // Status colors
  status: {
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
    errorDark: "#dc2626",
    info: "#3b82f6",
  },

  // Background colors
  background: {
    primary: "#fdf8f3",
    secondary: "#f8f4ef",
    tertiary: "#f0ece6",
    card: "#ffffff",
    modal: "rgba(0, 0, 0, 0.5)",
  },

  // Text colors
  text: {
    primary: "#1a1a1a",
    secondary: "#4b5563",
    tertiary: "#6b7280",
    light: "#9ca3af",
    white: "#ffffff",
  },

  // Border colors
  border: {
    light: "#e5e7eb",
    default: "#d1d5db",
    dark: "#9ca3af",
  },

  // Overlay colors
  overlay: {
    light: "rgba(255, 255, 255, 0.8)",
    dark: "rgba(0, 0, 0, 0.4)",
    glass: "rgba(255, 255, 255, 0.8)",
  },
};

// Typography tokens
export const typography = {
  // Font families
  fontFamily: {
    primary:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
    display:
      "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
    code: "'JetBrains Mono', 'Courier New', monospace",
  },

  // Font weights
  fontWeight: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },

  // Font sizes (in rem)
  fontSize: {
    xs: "0.75rem", // 12px
    sm: "0.875rem", // 14px
    base: "1rem", // 16px
    lg: "1.125rem", // 18px
    xl: "1.25rem", // 20px
    "2xl": "1.5rem", // 24px
    "3xl": "1.875rem", // 30px
    "4xl": "2.25rem", // 36px
    "5xl": "3rem", // 48px
  },

  // Line heights
  lineHeight: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },

  // Letter spacing
  letterSpacing: {
    tighter: "-0.05em",
    tight: "-0.025em",
    normal: "0em",
    wide: "0.025em",
    wider: "0.05em",
    widest: "0.1em",
  },
};

// Spacing system (in rem)
export const spacing = {
  "0": "0",
  "0.5": "0.125rem", // 2px
  "1": "0.25rem", // 4px
  "2": "0.5rem", // 8px
  "3": "0.75rem", // 12px
  "4": "1rem", // 16px
  "5": "1.25rem", // 20px
  "6": "1.5rem", // 24px
  "8": "2rem", // 32px
  "10": "2.5rem", // 40px
  "12": "3rem", // 48px
  "16": "4rem", // 64px
  "20": "5rem", // 80px
  "24": "6rem", // 96px
  "32": "8rem", // 128px
  "40": "10rem", // 160px
  "48": "12rem", // 192px
  "56": "14rem", // 224px
  "64": "16rem", // 256px
};

// Border radius
export const borderRadius = {
  none: "0",
  sm: "0.125rem", // 2px
  DEFAULT: "0.25rem", // 4px
  md: "0.375rem", // 6px
  lg: "0.5rem", // 8px
  xl: "0.75rem", // 12px
  "2xl": "1rem", // 16px
  "3xl": "1.5rem", // 24px
  "4xl": "2rem", // 32px
  full: "9999px",
};

// Shadows
export const shadows = {
  none: "none",
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  DEFAULT: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
  focus: "0 0 0 3px rgba(45, 90, 135, 0.6)",
  "focus-error": "0 0 0 3px rgba(239, 68, 68, 0.6)",
};

// Z-index
export const zIndex = {
  "0": "0",
  "10": "10",
  "20": "20",
  "30": "30",
  "40": "40",
  "50": "50",
  auto: "auto",
  dropdown: "1000",
  sticky: "1100",
  fixed: "1200",
  modal: "1300",
  tooltip: "1400",
  toast: "1500",
};

// Transitions
export const transitions = {
  duration: {
    fastest: "50ms",
    fast: "100ms",
    normal: "200ms",
    slow: "300ms",
    slower: "500ms",
  },
  timing: {
    ease: "ease",
    linear: "linear",
    easeIn: "cubic-bezier(0.4, 0, 1, 1)",
    easeOut: "cubic-bezier(0, 0, 0.2, 1)",
    easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
  },
};

// Media queries
export const breakpoints = {
  xs: "0px",
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
};

// Elevation - combines shadow and z-index for common components
export const elevation = {
  0: {
    boxShadow: shadows.none,
    zIndex: zIndex["0"],
  },
  1: {
    boxShadow: shadows.sm,
    zIndex: zIndex["10"],
  },
  2: {
    boxShadow: shadows.DEFAULT,
    zIndex: zIndex["20"],
  },
  3: {
    boxShadow: shadows.md,
    zIndex: zIndex["30"],
  },
  4: {
    boxShadow: shadows.lg,
    zIndex: zIndex["40"],
  },
  5: {
    boxShadow: shadows.xl,
    zIndex: zIndex["50"],
  },
};
