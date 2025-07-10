/**
 * Navbar.tsx - Main navigation component
 *
 * Modern, responsive navigation interface that provides access
 * to all main features of the CodeBoard application.
 */

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../theme/ThemeContext";

// Material UI Components
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Tooltip,
} from "@mui/material";

// Material UI icons
import HomeIcon from "@mui/icons-material/Home";
import AddIcon from "@mui/icons-material/Add";
import SettingsIcon from "@mui/icons-material/Settings";
import SearchIcon from "@mui/icons-material/Search";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import InfoIcon from "@mui/icons-material/Info";

interface NavbarProps {
  onSettingsClick: () => void;
}

/**
 * Main Navigation Bar Component
 */
const Navbar: React.FC<NavbarProps> = ({ onSettingsClick }) => {
  const navigate = useNavigate();
  const { mode, setTheme } = useTheme();

  // Handle theme toggle
  const handleThemeToggle = () => {
    setTheme(mode === "light" ? "dark" : "light");
  };

  return (
    <AppBar
      position="static"
      color="transparent"
      elevation={0}
      sx={{
        backdropFilter: "blur(8px)",
        backgroundColor:
          mode === "light"
            ? "rgba(253, 246, 233, 0.85)"
            : "rgba(31, 26, 23, 0.85)",
        borderBottom: 1,
        borderColor:
          mode === "light"
            ? "rgba(230, 213, 197, 0.5)"
            : "rgba(80, 70, 60, 0.5)",
        boxShadow:
          mode === "light"
            ? "0 2px 12px rgba(165, 138, 117, 0.08)"
            : "0 2px 12px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              textDecoration: "none",
              color: "inherit",
              display: "flex",
              alignItems: "center",
              gap: 1,
              fontWeight: 600,
              fontSize: { xs: "1.1rem", sm: "1.25rem" },
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            <Box
              component="span"
              sx={{
                backgroundColor: "primary.main",
                color: "white",
                borderRadius: "8px",
                width: "32px",
                height: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              CB
            </Box>
            CodeBoard
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 0.5 }}>
          <Tooltip title="New Note">
            <IconButton
              color="primary"
              onClick={() => navigate("/notes/create")}
              sx={{
                backgroundColor:
                  mode === "light"
                    ? "rgba(125, 90, 80, 0.04)"
                    : "rgba(231, 171, 121, 0.08)",
                "&:hover": {
                  backgroundColor:
                    mode === "light"
                      ? "rgba(125, 90, 80, 0.08)"
                      : "rgba(231, 171, 121, 0.16)",
                },
                transition: "all 0.2s",
              }}
            >
              <AddIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Search">
            <IconButton
              color="primary"
              onClick={() => navigate("/search")}
              sx={{
                backgroundColor:
                  mode === "light"
                    ? "rgba(125, 90, 80, 0.04)"
                    : "rgba(231, 171, 121, 0.08)",
                "&:hover": {
                  backgroundColor:
                    mode === "light"
                      ? "rgba(125, 90, 80, 0.08)"
                      : "rgba(231, 171, 121, 0.16)",
                },
                transition: "all 0.2s",
              }}
            >
              <SearchIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Settings">
            <IconButton
              color="primary"
              onClick={onSettingsClick}
              sx={{
                backgroundColor:
                  mode === "light"
                    ? "rgba(125, 90, 80, 0.04)"
                    : "rgba(231, 171, 121, 0.08)",
                "&:hover": {
                  backgroundColor:
                    mode === "light"
                      ? "rgba(125, 90, 80, 0.08)"
                      : "rgba(231, 171, 121, 0.16)",
                },
                transition: "all 0.2s",
              }}
            >
              <SettingsIcon />
            </IconButton>
          </Tooltip>

          <Tooltip
            title={`Switch to ${mode === "light" ? "dark" : "light"} mode`}
          >
            <IconButton
              onClick={handleThemeToggle}
              color="primary"
              sx={{
                backgroundColor:
                  mode === "light"
                    ? "rgba(125, 90, 80, 0.04)"
                    : "rgba(231, 171, 121, 0.08)",
                "&:hover": {
                  backgroundColor:
                    mode === "light"
                      ? "rgba(125, 90, 80, 0.08)"
                      : "rgba(231, 171, 121, 0.16)",
                },
                transition: "all 0.2s",
              }}
            >
              {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
          </Tooltip>

          <Tooltip title="About & Features">
            <IconButton
              color="primary"
              onClick={() => navigate("/about")}
              sx={{
                backgroundColor:
                  mode === "light"
                    ? "rgba(125, 90, 80, 0.04)"
                    : "rgba(231, 171, 121, 0.08)",
                "&:hover": {
                  backgroundColor:
                    mode === "light"
                      ? "rgba(125, 90, 80, 0.08)"
                      : "rgba(231, 171, 121, 0.16)",
                },
                transition: "all 0.2s",
              }}
            >
              <InfoIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
