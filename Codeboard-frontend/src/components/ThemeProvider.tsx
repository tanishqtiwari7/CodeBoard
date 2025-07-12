/**
 * Sophisticated Theme provider with elegant monochromatic color scheme
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

interface ThemeContextValue {
  theme: any;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("codeboard-theme");
    if (savedTheme) {
      setDarkMode(savedTheme === "dark");
    }

    // Update the document attribute for CSS theming
    document.documentElement.setAttribute("data-theme", savedTheme || "light");
  }, []);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: darkMode ? "#14b8a6" : "#0f766e", // Teal main
        dark: darkMode ? "#0d9488" : "#134e4a", // Darker teal
        light: darkMode ? "#5eead4" : "#99f6e4", // Lighter teal
      },
      secondary: {
        main: darkMode ? "#f97316" : "#ea580c", // Orange accent
        dark: darkMode ? "#ea580c" : "#c2410c", // Darker orange
        light: darkMode ? "#fed7aa" : "#ffedd5", // Lighter orange
      },
      background: {
        default: darkMode ? "#0f172a" : "#fef7f0", // Dark slate vs creamy peach
        paper: darkMode ? "#1e293b" : "#fefcfb", // Dark paper vs off-white peach
      },
      text: {
        primary: darkMode ? "#f1f5f9" : "#0f172a", // Light text vs dark text
        secondary: darkMode ? "#94a3b8" : "#475569", // Muted text
      },
      divider: darkMode ? "#374151" : "#e2e8f0", // Subtle dividers
    },
    typography: {
      fontFamily:
        '"Inter", "Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica Neue", Arial, sans-serif',
      h1: {
        fontWeight: 700,
        fontSize: "2.5rem",
        lineHeight: 1.2,
        letterSpacing: "-0.025em",
      },
      h2: {
        fontWeight: 600,
        fontSize: "2rem",
        lineHeight: 1.3,
        letterSpacing: "-0.025em",
      },
      h3: {
        fontWeight: 600,
        fontSize: "1.5rem",
        lineHeight: 1.4,
        letterSpacing: "-0.02em",
      },
      h4: {
        fontWeight: 600,
        fontSize: "1.25rem",
        lineHeight: 1.4,
        letterSpacing: "-0.02em",
      },
      h5: {
        fontWeight: 600,
        fontSize: "1.125rem",
        lineHeight: 1.5,
        letterSpacing: "-0.01em",
      },
      h6: {
        fontWeight: 600,
        fontSize: "1rem",
        lineHeight: 1.5,
        letterSpacing: "-0.01em",
      },
      body1: {
        fontSize: "1rem",
        lineHeight: 1.6,
        letterSpacing: "0.00938em",
      },
      body2: {
        fontSize: "0.875rem",
        lineHeight: 1.6,
        letterSpacing: "0.01071em",
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 500,
            borderRadius: 8,
            padding: "10px 20px",
            transition: "all 0.2s ease-in-out",
            boxShadow: "none",
            "&:hover": {
              boxShadow: darkMode
                ? "0 4px 12px rgba(20, 184, 166, 0.25)"
                : "0 4px 12px rgba(15, 118, 110, 0.25)",
              transform: "translateY(-1px)",
            },
            "&:active": {
              transform: "translateY(0)",
            },
          },
          contained: {
            backgroundColor: darkMode ? "#14b8a6" : "#0f766e",
            color: "#ffffff",
            "&:hover": {
              backgroundColor: darkMode ? "#0d9488" : "#134e4a",
            },
          },
          outlined: {
            borderColor: darkMode ? "#374151" : "#e2e8f0",
            color: darkMode ? "#14b8a6" : "#0f766e",
            "&:hover": {
              borderColor: darkMode ? "#14b8a6" : "#0f766e",
              backgroundColor: darkMode
                ? "rgba(20, 184, 166, 0.1)"
                : "rgba(15, 118, 110, 0.1)",
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            border: darkMode ? "1px solid #374151" : "1px solid #e2e8f0",
            backgroundColor: darkMode ? "#1e293b" : "#ffffff",
            boxShadow: darkMode
              ? "0 4px 6px -1px rgba(0, 0, 0, 0.3)"
              : "0 4px 6px -1px rgba(15, 118, 110, 0.1)",
            transition: "all 0.3s ease-in-out",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: darkMode
                ? "0 8px 25px -5px rgba(20, 184, 166, 0.2)"
                : "0 8px 25px -5px rgba(15, 118, 110, 0.2)",
              borderColor: darkMode ? "#14b8a6" : "#0f766e",
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: 8,
              backgroundColor: darkMode
                ? "rgba(30, 41, 59, 0.5)"
                : "rgba(248, 250, 252, 0.8)",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                backgroundColor: darkMode
                  ? "rgba(30, 41, 59, 0.7)"
                  : "rgba(248, 250, 252, 0.9)",
              },
              "&.Mui-focused": {
                backgroundColor: darkMode ? "rgba(30, 41, 59, 0.8)" : "#ffffff",
                boxShadow: darkMode
                  ? "0 0 0 2px rgba(20, 184, 166, 0.3)"
                  : "0 0 0 2px rgba(15, 118, 110, 0.3)",
              },
              "& fieldset": {
                borderColor: darkMode ? "#374151" : "#e2e8f0",
              },
              "&:hover fieldset": {
                borderColor: darkMode ? "#14b8a6" : "#0f766e",
              },
              "&.Mui-focused fieldset": {
                borderColor: darkMode ? "#14b8a6" : "#0f766e",
              },
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: darkMode
              ? "rgba(15, 23, 42, 0.95)"
              : "rgba(248, 250, 252, 0.95)",
            backdropFilter: "blur(20px)",
            borderBottom: darkMode ? "1px solid #374151" : "1px solid #e2e8f0",
            boxShadow: darkMode
              ? "0 1px 3px rgba(0, 0, 0, 0.3)"
              : "0 1px 3px rgba(15, 118, 110, 0.1)",
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 500,
            fontSize: "0.875rem",
            color: darkMode ? "#94a3b8" : "#475569",
            "&.Mui-selected": {
              color: darkMode ? "#14b8a6" : "#0f766e",
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            backgroundColor: darkMode
              ? "rgba(20, 184, 166, 0.1)"
              : "rgba(15, 118, 110, 0.1)",
            color: darkMode ? "#14b8a6" : "#0f766e",
            "&:hover": {
              backgroundColor: darkMode
                ? "rgba(20, 184, 166, 0.2)"
                : "rgba(15, 118, 110, 0.2)",
            },
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            color: darkMode ? "#f1f5f9" : "#0f172a",
          },
          h1: {
            color: darkMode ? "#f1f5f9" : "#0f172a",
            fontWeight: 700,
          },
          h2: {
            color: darkMode ? "#f1f5f9" : "#0f172a",
            fontWeight: 600,
          },
          h3: {
            color: darkMode ? "#f1f5f9" : "#0f172a",
            fontWeight: 600,
          },
          h4: {
            color: darkMode ? "#f1f5f9" : "#0f172a",
            fontWeight: 600,
          },
          h5: {
            color: darkMode ? "#f1f5f9" : "#0f172a",
            fontWeight: 600,
          },
          h6: {
            color: darkMode ? "#f1f5f9" : "#0f172a",
            fontWeight: 600,
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: darkMode ? "#94a3b8" : "#475569",
            "&.Mui-focused": {
              color: darkMode ? "#14b8a6" : "#0f766e",
            },
          },
        },
      },
      MuiFormHelperText: {
        styleOverrides: {
          root: {
            color: darkMode ? "#94a3b8" : "#475569",
          },
        },
      },
    },
  });

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    const themeValue = newMode ? "dark" : "light";
    localStorage.setItem("codeboard-theme", themeValue);
    document.documentElement.setAttribute("data-theme", themeValue);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}
