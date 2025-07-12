/**
 * HorizontalTagSelector Component
 * A horizontal menu for selecting predefined tags
 */

import React from "react";
import { Box, Chip, Typography, Paper, useTheme } from "@mui/material";
import { PREDEFINED_TAGS, type TagOption } from "../constants/tags";

interface HorizontalTagSelectorProps {
  selectedTags: string[];
  onTagChange: (tags: string[]) => void;
  maxHeight?: number;
}

const HorizontalTagSelector: React.FC<HorizontalTagSelectorProps> = ({
  selectedTags,
  onTagChange,
  maxHeight = 200,
}) => {
  const theme = useTheme();

  const handleTagClick = (tagName: string) => {
    const isSelected = selectedTags.includes(tagName);
    let newTags: string[];

    if (isSelected) {
      // Remove tag
      newTags = selectedTags.filter((tag) => tag !== tagName);
    } else {
      // Add tag
      newTags = [...selectedTags, tagName];
    }

    onTagChange(newTags);
  };

  const isTagSelected = (tagName: string): boolean => {
    return selectedTags.includes(tagName);
  };

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Select tags by clicking on them:
      </Typography>

      <Paper
        variant="outlined"
        sx={{
          p: 2,
          maxHeight: maxHeight,
          overflowY: "auto",
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            alignItems: "center",
          }}
        >
          {PREDEFINED_TAGS.map((tag: TagOption) => {
            const isSelected = isTagSelected(tag.name);

            return (
              <Chip
                key={tag.name}
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <span>{tag.emoji}</span>
                    <span>{tag.displayName}</span>
                  </Box>
                }
                onClick={() => handleTagClick(tag.name)}
                color={isSelected ? "primary" : "default"}
                variant={isSelected ? "filled" : "outlined"}
                sx={{
                  cursor: "pointer",
                  borderRadius: 3,
                  fontSize: "0.875rem",
                  height: 32,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: isSelected
                      ? theme.palette.primary.dark
                      : theme.palette.action.hover,
                    transform: "translateY(-1px)",
                    boxShadow: theme.shadows[2],
                  },
                  ...(isSelected && {
                    backgroundColor: tag.color,
                    color: theme.palette.getContrastText(tag.color),
                    "&:hover": {
                      backgroundColor: tag.color,
                      filter: "brightness(0.9)",
                    },
                  }),
                }}
                title={tag.description}
              />
            );
          })}
        </Box>
      </Paper>

      {selectedTags.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Selected tags ({selectedTags.length}):
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {selectedTags.map((tagName) => {
              const tag = PREDEFINED_TAGS.find((t) => t.name === tagName);
              return (
                <Chip
                  key={tagName}
                  size="small"
                  label={
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <span>{tag?.emoji || "🏷️"}</span>
                      <span>{tag?.displayName || tagName}</span>
                    </Box>
                  }
                  onDelete={() => handleTagClick(tagName)}
                  sx={{
                    backgroundColor: tag?.color || theme.palette.primary.main,
                    color: theme.palette.getContrastText(
                      tag?.color || theme.palette.primary.main
                    ),
                    "& .MuiChip-deleteIcon": {
                      color: "inherit",
                    },
                  }}
                />
              );
            })}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default HorizontalTagSelector;
