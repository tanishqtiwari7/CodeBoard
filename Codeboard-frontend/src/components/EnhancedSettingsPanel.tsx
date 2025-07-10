import React, { useState, useEffect } from "react";
import { useTheme } from "../theme/ThemeContext";
import { useToast } from "./ToastProvider";
import {
  Box,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  Slider,
  Select,
  MenuItem,
  Button,
  Divider,
  FormControl,
  InputLabel,
} from "@mui/material";
import { styled } from "@mui/material/styles";

// Material UI Icons
import CloseIcon from "@mui/icons-material/Close";
import PaletteIcon from "@mui/icons-material/Palette";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import CodeIcon from "@mui/icons-material/Code";
import StorageIcon from "@mui/icons-material/Storage";
import BackupIcon from "@mui/icons-material/Backup";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "space-between",
}));

const SettingsSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
}));

/**
 * Enhanced Settings Panel Component
 */
const EnhancedSettingsPanel: React.FC<SettingsPanelProps> = ({
  isOpen,
  onClose,
}) => {
  const { mode, setTheme } = useTheme();
  const { showToast } = useToast();

  // Settings state
  const [fontSize, setFontSize] = useState(() => {
    return parseInt(localStorage.getItem("codeboard-fontSize") || "16");
  });

  const [codeTheme, setCodeTheme] = useState(() => {
    return localStorage.getItem("codeboard-codeTheme") || "github";
  });

  // Apply font size on component mount
  useEffect(() => {
    const savedFontSize = localStorage.getItem("codeboard-fontSize") || "16";
    document.documentElement.style.fontSize = `${savedFontSize}px`;
  }, []);

  // Handle theme toggle
  const handleThemeToggle = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setTheme(newMode);
    showToast("success", `Switched to ${newMode} theme`);
  };

  // Handle font size change
  const handleFontSizeChange = (_event: Event, newValue: number | number[]) => {
    const size = newValue as number;
    setFontSize(size);
    localStorage.setItem("codeboard-fontSize", size.toString());
    // Font size change notification removed

    // Apply font size to document
    document.documentElement.style.fontSize = `${size}px`;
  };

  // Handle code theme change
  const handleCodeThemeChange = (event: { target: { value: string } }) => {
    const theme = event.target.value;
    setCodeTheme(theme);
    localStorage.setItem("codeboard-codeTheme", theme);
    showToast("success", `Code theme updated to ${theme}`);
  };

  // Handle data export
  const handleExportData = () => {
    try {
      const data = {
        settings: {
          fontSize,
          codeTheme,
          theme: mode,
        },
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "codeboard-settings.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showToast("success", "Settings exported successfully");
    } catch (error) {
      showToast("error", "Failed to export settings");
    }
  };

  // Handle data import
  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);

        // Apply imported settings
        if (data.settings) {
          if (data.settings.fontSize) {
            setFontSize(data.settings.fontSize);
            localStorage.setItem(
              "codeboard-fontSize",
              data.settings.fontSize.toString()
            );
          }

          if (data.settings.codeTheme) {
            setCodeTheme(data.settings.codeTheme);
            localStorage.setItem(
              "codeboard-codeTheme",
              data.settings.codeTheme
            );
          }

          if (data.settings.theme) {
            setTheme(data.settings.theme);
          }
        }

        showToast("success", "Settings imported successfully");
      } catch (error) {
        showToast("error", "Failed to import settings");
      }
    };
    reader.readAsText(file);
  };

  // Handle data reset
  const handleResetData = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: 360,
          boxSizing: "border-box",
        },
      }}
    >
      <DrawerHeader>
        <Typography variant="h6">Settings</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DrawerHeader>

      <Divider />

      <List sx={{ flex: 1, overflow: "auto" }}>
        {/* Appearance Section */}
        <SettingsSection>
          <Typography variant="subtitle1" gutterBottom>
            <PaletteIcon sx={{ mr: 1, verticalAlign: "middle" }} />
            Appearance
          </Typography>

          <ListItem>
            <ListItemIcon>
              {mode === "dark" ? <DarkModeIcon /> : <LightModeIcon />}
            </ListItemIcon>
            <ListItemText primary="Dark Mode" />
            <Switch
              edge="end"
              checked={mode === "dark"}
              onChange={handleThemeToggle}
            />
          </ListItem>

          <ListItem>
            <ListItemIcon>
              <TextFieldsIcon />
            </ListItemIcon>
            <ListItemText
              primary="Font Size"
              secondary={`${fontSize}px`}
              sx={{ mr: 2 }}
            />
            <Slider
              value={fontSize}
              onChange={handleFontSizeChange}
              min={12}
              max={24}
              step={1}
              sx={{ maxWidth: 100 }}
            />
          </ListItem>

          <ListItem>
            <ListItemIcon>
              <CodeIcon />
            </ListItemIcon>
            <FormControl fullWidth>
              <InputLabel>Code Theme</InputLabel>
              <Select
                value={codeTheme}
                onChange={handleCodeThemeChange}
                label="Code Theme"
              >
                <MenuItem value="github">GitHub</MenuItem>
                <MenuItem value="monokai">Monokai</MenuItem>
                <MenuItem value="dracula">Dracula</MenuItem>
                <MenuItem value="solarized">Solarized</MenuItem>
              </Select>
            </FormControl>
          </ListItem>
        </SettingsSection>

        <Divider />

        {/* Data Management Section */}
        <SettingsSection>
          <Typography variant="subtitle1" gutterBottom>
            <StorageIcon sx={{ mr: 1, verticalAlign: "middle" }} />
            Data Management
          </Typography>

          <ListItem>
            <ListItemIcon>
              <BackupIcon />
            </ListItemIcon>
            <ListItemText
              primary="Import Settings"
              secondary="Restore your settings from a backup"
            />
            <Button component="label" variant="outlined" size="small">
              Import
              <input
                type="file"
                accept=".json"
                hidden
                onChange={handleImportData}
              />
            </Button>
          </ListItem>

          <ListItem>
            <ListItemIcon>
              <DownloadIcon />
            </ListItemIcon>
            <ListItemText
              primary="Export Settings"
              secondary="Save your settings to a file"
            />
            <Button variant="outlined" size="small" onClick={handleExportData}>
              Export
            </Button>
          </ListItem>

          <ListItem>
            <ListItemIcon>
              <DeleteSweepIcon />
            </ListItemIcon>
            <ListItemText
              primary="Reset All Settings"
              secondary="Clear all data and restore defaults"
            />
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={handleResetData}
            >
              Reset
            </Button>
          </ListItem>
        </SettingsSection>
      </List>
    </Drawer>
  );
};

export default EnhancedSettingsPanel;
