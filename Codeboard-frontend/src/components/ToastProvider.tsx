/**
 * ToastProvider.tsx - Global toast notification system
 *
 * A modern, accessible, and customizable toast notification system that provides
 * contextual feedback to user actions with different severity levels.
 */

import React, { useState, createContext, useContext, useCallback } from "react";
import { Box, Alert, IconButton, Snackbar } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "../theme/ThemeContext";
import type { Theme } from "@mui/material/styles";

// Types
export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextValue {
  showToast: (type: ToastType, message: string, duration?: number) => void;
  hideToast: (id: string) => void;
  clearAllToasts: () => void;
}

// Create context with proper typing
const ToastContext = createContext<ToastContextValue | undefined>(undefined);

/**
 * Custom hook to access toast functionality throughout the app
 *
 * @example
 * const { showToast } = useToast();
 * showToast({
 *   type: 'success',
 *   title: 'Success!',
 *   message: 'Operation completed successfully'
 * });
 */
// Changed to function declaration instead of const export
function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

// Export the hook
export { useToast };

/**
 * Toast Provider Component
 * Manages global toast notifications
 */
// Changed from export const to function declaration for better compatibility
function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const { theme } = useTheme();

  // Remove toast by ID
  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // Add new toast notification (defined after hideToast to use it in dependencies)
  const showToast = useCallback(
    (type: ToastType, message: string, duration = 5000) => {
      const id = Math.random().toString(36).slice(2);
      setToasts((prev) => [...prev, { id, type, message, duration }]);

      // Auto-hide toast after specified duration
      if (duration !== 0) {
        setTimeout(() => {
          hideToast(id);
        }, duration);
      }
    },
    [hideToast]
  );

  // Clear all toasts
  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const value = {
    showToast,
    hideToast,
    clearAllToasts,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Box
        sx={{
          position: "fixed",
          bottom: (theme as Theme).spacing(2), // Changed to bottom
          left: (theme as Theme).spacing(2), // Changed to left
          zIndex: (theme as Theme).zIndex.snackbar,
          display: "flex",
          flexDirection: "column",
          gap: (theme as Theme).spacing(1),
          maxWidth: "calc(100% - 32px)",
        }}
      >
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
            >
              <Alert
                severity={toast.type}
                sx={{
                  boxShadow: 3,
                  borderRadius: 2,
                  width: "100%",
                  maxWidth: "400px",
                }}
                action={
                  <>
                    {toast.action && (
                      <IconButton
                        size="small"
                        color="inherit"
                        onClick={toast.action.onClick}
                      >
                        {toast.action.label}
                      </IconButton>
                    )}
                    <IconButton
                      size="small"
                      color="inherit"
                      onClick={() => hideToast(toast.id)}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </>
                }
                onClose={() => hideToast(toast.id)}
              >
                {toast.message}
              </Alert>
            </motion.div>
          ))}
        </AnimatePresence>
      </Box>
    </ToastContext.Provider>
  );
}

// Export the provider component
export { ToastProvider };
export default ToastProvider;
