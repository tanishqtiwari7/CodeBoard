/**
 * CodeBoard App.tsx
 */

import { Routes, Route, Navigate } from "react-router-dom";

// Pages
import HomePage from "./pages/HomePage";
import CreateNotePage from "./pages/CreateNotePage";
import NoteDetailPage from "./pages/NoteDetailPage";
import FeatureDemoPage from "./pages/FeatureDemoPage";
import AboutPage from "./pages/AboutPage";

// Components
import Navbar from "./components/Navbar";
import { ToastProvider } from "./components/ToastProvider";
import { ThemeProvider } from "./components/ThemeProvider";

import "./index.css";

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <div className="app">
          <Navbar />
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
        </div>
      </ToastProvider>
    </ThemeProvider>
  );
}
