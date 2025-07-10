import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SettingsIcon from "@mui/icons-material/Settings";
import { useToast } from "./ToastProvider";

interface QuickActionsProps {
  onSearch?: () => void;
  onSettings?: () => void;
  onBookmarks?: () => void;
  onStats?: () => void;
}

/**
 * Quick Actions Floating Button
 *
 * Provides quick access to common actions:
 * - Create new note
 * - Open search
 * - View bookmarks
 * - Show statistics
 * - Open settings
 */
const QuickActions: React.FC<QuickActionsProps> = ({
  onSearch,
  onSettings,
  onBookmarks,
  onStats,
}) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const actions = [
    {
      icon: <AddIcon />,
      name: "New Note",
      onClick: () => {
        navigate("/create");
        showToast("info", "Ready to create a new note!", 2000);
      },
    },
    {
      icon: <SearchIcon />,
      name: "Search",
      onClick: () => {
        if (onSearch) {
          onSearch();
        } else {
          navigate("/?search=true");
        }
        showToast("info", "Search functionality activated!", 2000);
      },
    },
    {
      icon: <BookmarkIcon />,
      name: "Bookmarks",
      onClick: () => {
        if (onBookmarks) {
          onBookmarks();
        } else {
          showToast("info", "Bookmark feature coming soon!", 3000);
        }
      },
    },
    {
      icon: <TrendingUpIcon />,
      name: "Statistics",
      onClick: () => {
        if (onStats) {
          onStats();
        } else {
          showToast("info", "View your coding activity stats!", 3000);
        }
      },
    },
    {
      icon: <SettingsIcon />,
      name: "Settings",
      onClick: () => {
        if (onSettings) {
          onSettings();
        } else {
          showToast("info", "Open application settings!", 2000);
        }
      },
    },
  ];

  return (
    <SpeedDial
      ariaLabel="Quick Actions"
      sx={{
        position: "fixed",
        bottom: 32,
        right: 32,
        zIndex: 1000,
        "& .MuiSpeedDial-fab": {
          backgroundColor: "var(--accent)",
          color: "var(--white)",
          "&:hover": {
            backgroundColor: "var(--sunset)",
          },
          width: 56,
          height: 56,
          boxShadow: "0 4px 20px rgba(251, 162, 87, 0.3)",
        },
        "& .MuiSpeedDialAction-fab": {
          backgroundColor: "var(--white)",
          color: "var(--primary)",
          border: "2px solid var(--border)",
          "&:hover": {
            backgroundColor: "var(--ocean-mist)",
            borderColor: "var(--primary)",
          },
          boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)",
        },
        "& .MuiSpeedDialAction-staticTooltipLabel": {
          backgroundColor: "var(--primary)",
          color: "var(--white)",
          fontSize: "0.8rem",
          padding: "6px 12px",
          borderRadius: "6px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
          fontWeight: 600,
        },
      }}
      icon={<SpeedDialIcon />}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      direction="up"
    >
      {actions.map((action) => (
        <SpeedDialAction
          key={action.name}
          icon={action.icon}
          tooltipTitle={action.name}
          tooltipOpen
          onClick={() => {
            action.onClick();
            setOpen(false);
          }}
          sx={{
            "& .MuiSpeedDialAction-staticTooltipLabel": {
              minWidth: "auto",
              whiteSpace: "nowrap",
            },
          }}
        />
      ))}
    </SpeedDial>
  );
};

export default QuickActions;
