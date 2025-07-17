/**
 * Responsive Navigation Bar with Hamburger Menu
 */

import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme as useMuiTheme,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "./ThemeProvider";
import { styled } from "@mui/material/styles";

// Icons
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import CodeIcon from "@mui/icons-material/Code";
import HomeIcon from "@mui/icons-material/Home";
import CreateIcon from "@mui/icons-material/Create";
import InfoIcon from "@mui/icons-material/Info";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

// Styled Components
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background:
    theme.palette.mode === "dark"
      ? "rgba(18, 18, 18, 0.95)"
      : "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(20px)",
  borderBottom:
    theme.palette.mode === "dark"
      ? "1px solid rgba(255, 255, 255, 0.1)"
      : "1px solid rgba(0, 0, 0, 0.08)",
  boxShadow:
    theme.palette.mode === "dark"
      ? "0 8px 32px rgba(0, 0, 0, 0.3)"
      : "0 8px 32px rgba(0, 0, 0, 0.1)",
}));

const NavButton = styled(Button)(({ theme }) => ({
  color: theme.palette.mode === "dark" ? "#e0e0e0" : "#2d3748",
  fontWeight: 500,
  fontSize: "0.95rem",
  padding: "8px 16px",
  borderRadius: "8px",
  margin: "0 4px",
  "&:hover": {
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255, 255, 255, 0.1)"
        : "rgba(0, 0, 0, 0.04)",
  },
}));

const LogoContainer = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
  gap: "12px",
}));

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  "& .MuiDrawer-paper": {
    width: 280,
    backgroundColor: theme.palette.mode === "dark" ? "#1a1a1a" : "#ffffff",
    borderRight:
      theme.palette.mode === "dark"
        ? "1px solid rgba(255, 255, 255, 0.1)"
        : "1px solid rgba(0, 0, 0, 0.08)",
  },
}));

export default function Navbar() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("md"));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { icon: HomeIcon, label: "Home", path: "/" },
    { icon: CreateIcon, label: "Create", path: "/notes/create" },
    { icon: InfoIcon, label: "About", path: "/about" },
    { icon: PlayArrowIcon, label: "Demo", path: "/demo" },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <StyledAppBar position="static" elevation={0}>
        <Toolbar
          sx={{
            padding: { xs: "8px 16px", md: "12px 32px" },
            justifyContent: "space-between",
            minHeight: { xs: "64px", md: "72px" },
          }}
        >
          {/* Logo */}
          <LogoContainer onClick={() => navigate("/")}>
            <CodeIcon
              sx={{
                fontSize: { xs: 28, md: 32 },
                color: theme.palette.mode === "dark" ? "#4ecdc4" : "#667eea",
              }}
            />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: { xs: "1.1rem", md: "1.25rem" },
                background:
                  theme.palette.mode === "dark"
                    ? "linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)"
                    : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                display: { xs: "none", sm: "block" },
              }}
            >
              CodeBoard
            </Typography>
          </LogoContainer>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {navItems.map((item) => (
                <NavButton
                  key={item.path}
                  startIcon={<item.icon />}
                  onClick={() => navigate(item.path)}
                >
                  {item.label}
                </NavButton>
              ))}

              <IconButton
                onClick={toggleTheme}
                sx={{
                  ml: 2,
                  color: theme.palette.mode === "dark" ? "#e0e0e0" : "#2d3748",
                }}
              >
                {theme.palette.mode === "dark" ? (
                  <LightModeIcon />
                ) : (
                  <DarkModeIcon />
                )}
              </IconButton>
            </Box>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton
                onClick={toggleTheme}
                sx={{
                  color: theme.palette.mode === "dark" ? "#e0e0e0" : "#2d3748",
                }}
              >
                {theme.palette.mode === "dark" ? (
                  <LightModeIcon />
                ) : (
                  <DarkModeIcon />
                )}
              </IconButton>

              <IconButton
                onClick={handleMobileMenuToggle}
                sx={{
                  color: theme.palette.mode === "dark" ? "#e0e0e0" : "#2d3748",
                }}
              >
                {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </StyledAppBar>

      {/* Mobile Drawer */}
      <StyledDrawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      >
        <Box sx={{ pt: 2 }}>
          {/* Logo in Drawer */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              px: 3,
              pb: 2,
              borderBottom:
                theme.palette.mode === "dark"
                  ? "1px solid rgba(255, 255, 255, 0.1)"
                  : "1px solid rgba(0, 0, 0, 0.08)",
            }}
          >
            <CodeIcon
              sx={{
                fontSize: 32,
                color: theme.palette.mode === "dark" ? "#4ecdc4" : "#667eea",
              }}
            />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                background:
                  theme.palette.mode === "dark"
                    ? "linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)"
                    : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              CodeBoard
            </Typography>
          </Box>

          {/* Navigation Items */}
          <List sx={{ pt: 2 }}>
            {navItems.map((item) => (
              <ListItem
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  borderRadius: "8px",
                  mx: 2,
                  mb: 1,
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgba(255, 255, 255, 0.1)"
                        : "rgba(0, 0, 0, 0.04)",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color:
                      theme.palette.mode === "dark" ? "#e0e0e0" : "#2d3748",
                    minWidth: 40,
                  }}
                >
                  <item.icon />
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  sx={{
                    "& .MuiListItemText-primary": {
                      fontWeight: 500,
                      color:
                        theme.palette.mode === "dark" ? "#e0e0e0" : "#2d3748",
                    },
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </StyledDrawer>
    </>
  );
}
