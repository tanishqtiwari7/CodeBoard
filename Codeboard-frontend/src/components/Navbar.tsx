/**
 * Elegant Professional Navigation Bar
 */

import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTheme } from "./ThemeProvider";
import { motion } from "framer-motion";
import { styled } from "@mui/material/styles";

// Icons
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
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
  transition: "all 0.3s ease",
}));

const NavButton = styled(Button)(({ theme }) => ({
  position: "relative",
  color: theme.palette.mode === "dark" ? "#e0e0e0" : "#2d3748",
  fontWeight: 500,
  fontSize: "0.95rem",
  padding: "8px 16px",
  borderRadius: "12px",
  textTransform: "none",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255, 255, 255, 0.1)"
        : "rgba(0, 0, 0, 0.04)",
    transform: "translateY(-1px)",
  },
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: "-8px",
    left: "50%",
    transform: "translateX(-50%) scaleX(0)",
    width: "60%",
    height: "2px",
    background:
      theme.palette.mode === "dark"
        ? "linear-gradient(90deg, #ff6b6b, #4ecdc4)"
        : "linear-gradient(90deg, #667eea, #764ba2)",
    borderRadius: "2px",
    transition: "transform 0.3s ease",
  },
  "&:hover::after": {
    transform: "translateX(-50%) scaleX(1)",
  },
}));

const LogoContainer = styled(motion.div)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "12px",
  cursor: "pointer",
  padding: "4px 8px",
  borderRadius: "12px",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255, 255, 255, 0.05)"
        : "rgba(0, 0, 0, 0.02)",
  },
}));

const ThemeToggle = styled(IconButton)(({ theme }) => ({
  color: theme.palette.mode === "dark" ? "#e0e0e0" : "#2d3748",
  padding: "10px",
  borderRadius: "12px",
  border:
    theme.palette.mode === "dark"
      ? "1px solid rgba(255, 255, 255, 0.1)"
      : "1px solid rgba(0, 0, 0, 0.08)",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255, 255, 255, 0.1)"
        : "rgba(0, 0, 0, 0.04)",
    transform: "translateY(-1px)",
  },
}));

export default function Navbar() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { icon: HomeIcon, label: "Home", path: "/" },
    { icon: CreateIcon, label: "Create", path: "/notes/create" },
    { icon: InfoIcon, label: "About", path: "/about" },
    { icon: PlayArrowIcon, label: "Demo", path: "/demo" },
  ];

  return (
    <StyledAppBar position="static" elevation={0}>
      <Toolbar
        sx={{
          padding: "12px 32px",
          justifyContent: "space-between",
          minHeight: "72px",
        }}
      >
        <LogoContainer
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          onClick={() => navigate("/")}
        >
          <motion.div whileHover={{ rotate: 5 }} transition={{ duration: 0.3 }}>
            <CodeIcon
              sx={{
                fontSize: 32,
                color: theme.palette.mode === "dark" ? "#4ecdc4" : "#667eea",
                filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))",
              }}
            />
          </motion.div>
          <Typography
            variant="h5"
            component="div"
            sx={{
              fontWeight: 700,
              color: theme.palette.mode === "dark" ? "#ffffff" : "#2d3748",
              letterSpacing: "-0.5px",
              fontSize: "1.5rem",
            }}
          >
            CodeBoard
          </Typography>
        </LogoContainer>

        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          {navItems.map((item, index) => (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <NavButton
                startIcon={<item.icon sx={{ fontSize: "18px" }} />}
                onClick={() => navigate(item.path)}
              >
                {item.label}
              </NavButton>
            </motion.div>
          ))}

          <Box sx={{ ml: 2 }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <ThemeToggle onClick={toggleTheme} size="medium">
                <motion.div
                  animate={{ rotate: theme.palette.mode === "dark" ? 0 : 180 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  {theme.palette.mode === "dark" ? (
                    <LightModeIcon sx={{ fontSize: "20px" }} />
                  ) : (
                    <DarkModeIcon sx={{ fontSize: "20px" }} />
                  )}
                </motion.div>
              </ThemeToggle>
            </motion.div>
          </Box>
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
}
