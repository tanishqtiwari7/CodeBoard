/**
 * Toast notification system
 * Provides basic success/error/info messages
 */

import React, { useState, createContext, useContext, useCallback } from "react";
import { Alert, Snackbar } from "@mui/material";

export type ToastType = "success" | "error" | "warning" | "info";

interface ToastContextValue {
  showToast: (type: ToastType, message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<{
    open: boolean;
    type: ToastType;
    message: string;
  }>({ open: false, type: "info", message: "" });

  const showToast = useCallback(
    (type: ToastType, message: string, duration = 3000) => {
      setToast({ open: true, type, message });
      setTimeout(
        () => setToast((prev) => ({ ...prev, open: false })),
        duration
      );
    },
    []
  );

  const handleClose = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleClose}
          severity={toast.type}
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
}
