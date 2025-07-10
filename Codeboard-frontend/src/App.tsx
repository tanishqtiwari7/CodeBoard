/**
 * App.tsx - Main entry point for the CodeBoard ap              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/notes/create" element={<CreateNotePage />} />
                <Route path="/note/:id" element={<NoteDetailPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/demo" element={<FeatureDemoPage />} />tion
 *
 * This file sets up:
 * - Theme provider for consistent styling and dark/light mode
 * - React Router for navigation between pages
 * - Main layout structure with navigation and content areas
 * - Error boundary for graceful error handling
 * - Toast notifications system
 */

import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Main pages
import HomePage from "./pages/HomePage";
import CreateNotePage from "./pages/CreateNotePage";
import NoteDetailPage from "./pages/NoteDetailPage";
import FeatureDemoPage from "./pages/FeatureDemoPage";
import AboutPage from "./pages/AboutPage";

// Components
import Navbar from "./components/Navbar";
import { ToastProvider } from "./components/ToastProvider";
import ApiHealthCheck from "./components/ApiHealthCheck";
import ErrorBoundary from "./components/ErrorBoundary";
import EnhancedSettingsPanel from "./components/EnhancedSettingsPanel";

// Theme provider for styling and dark/light mode
import { ThemeProvider } from "./theme/ThemeContext";

// Global styles
import "./index.css";

/**
 * App Component - Main entry point for the frontend
 */
const App: React.FC = () => {
  // State for settings panel
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Apply font size on app load
  useEffect(() => {
    const savedFontSize = localStorage.getItem("codeboard-fontSize") || "16";
    document.documentElement.style.fontSize = `${savedFontSize}px`;
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <div className="app">
            <Navbar onSettingsClick={() => setIsSettingsOpen(true)} />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/notes/create" element={<CreateNotePage />} />
                <Route path="/note/:id" element={<NoteDetailPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/demo" element={<FeatureDemoPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <EnhancedSettingsPanel
              isOpen={isSettingsOpen}
              onClose={() => setIsSettingsOpen(false)}
            />
            <ApiHealthCheck hideWhenConnected={false} autoHideDelay={5000} />
          </div>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
