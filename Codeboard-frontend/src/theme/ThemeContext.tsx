import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from "@mui/material/styles";
import type { Theme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { colors, elevationShadows } from "./theme";

export type ThemeMode = "light" | "dark";

export interface ThemeContextValue {
  mode: ThemeMode;
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const savedMode = localStorage.getItem("theme-mode");
    return (savedMode as ThemeMode) || "light";
  });

  const toggleTheme = useCallback(() => {
    setMode((prev) => {
      const newMode = prev === "light" ? "dark" : "light";
      localStorage.setItem("theme-mode", newMode);
      return newMode;
    });
  }, []);

  const setTheme = useCallback((newMode: ThemeMode) => {
    localStorage.setItem("theme-mode", newMode);
    setMode(newMode);
  }, []);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === "light" ? colors.primary : colors.accent,
            light: mode === "light" ? colors.secondary : colors.highlight,
            dark: mode === "light" ? colors.mocha : colors.mocha,
            contrastText: colors.white,
          },
          secondary: {
            main: mode === "light" ? colors.secondary : colors.sand,
            light: mode === "light" ? colors.accent : colors.cream,
            dark: mode === "light" ? colors.mocha : colors.mocha,
          },
          error: {
            main: colors.error,
            dark: colors.errorDark,
          },
          background: {
            default: mode === "light" ? colors.background : "#1f1a17",
            paper: mode === "light" ? colors.cardBg : "#2a2520",
          },
          text: {
            primary: mode === "light" ? colors.text : "#f5f0e8",
            secondary: mode === "light" ? colors.textLight : "#d0c5b8",
          },
        },
        typography: {
          fontFamily: "'Poppins', 'Roboto', 'Arial', sans-serif",
          h1: {
            fontWeight: 600,
          },
          h2: {
            fontWeight: 600,
          },
          h3: {
            fontWeight: 500,
          },
        },
        shape: {
          borderRadius: 12,
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                scrollbarColor:
                  mode === "dark" ? "#6b6b6b #2b2b2b" : "#c0ad9a #f5f5f5",
                "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
                  width: "8px",
                  height: "8px",
                },
                "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
                  borderRadius: 8,
                  backgroundColor: mode === "dark" ? "#6b6b6b" : "#c0ad9a",
                  minHeight: 24,
                },
                "&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track": {
                  borderRadius: 8,
                  backgroundColor: mode === "dark" ? "#2b2b2b" : "#f5f5f5",
                },
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: "28px",
                boxShadow: mode === "light" ? elevationShadows.small : "none",
                textTransform: "none",
                fontWeight: 500,
                padding: "8px 20px",
              },
              contained: {
                "&:hover": {
                  boxShadow: elevationShadows.medium,
                },
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: "16px",
                boxShadow: elevationShadows.card,
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              rounded: {
                borderRadius: "16px",
              },
            },
          },
        },
      }),
    [mode]
  );

  const value = {
    mode,
    theme,
    toggleTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
