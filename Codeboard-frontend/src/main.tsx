/**
 * Main entry point for the CodeBoard frontend application
 *
 * Sets up:
 * - React DOM rendering
 * - BrowserRouter for client-side routing
 * - StrictMode for development aids
 */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

// Get the root element and create a React root
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");
const root = createRoot(rootElement);

// Configure basename for GitHub Pages deployment
const basename = import.meta.env.PROD ? "/CodeBoard" : "";

// Render the app wrapped in required providers
root.render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </StrictMode>
);
