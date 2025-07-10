/**
 * CreateNotePage.tsx
 *
 * Modern implementation of the note creation page with:
 * - Form validation
 * - Rich tag selection with horizontal multi-select tag picker
 * - Code editor with syntax highlighting
 * - Responsive layout
 * - Error handling and loading states
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createNote } from "../services/api";
import { getTags } from "../services/codeboardApi";
import { useToast } from "../components/ToastProvider";
import { useTheme } from "../theme/ThemeContext";

// Material UI Components
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Container,
  Chip,
  FormHelperText,
  CircularProgress,
  Stack,
  Card,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";

// Material UI Icons
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CodeIcon from "@mui/icons-material/Code";
import DescriptionIcon from "@mui/icons-material/Description";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import LabelIcon from "@mui/icons-material/Label";
import TitleIcon from "@mui/icons-material/Title";

// Code Editor
import Editor from "@monaco-editor/react";

// Modern form validation
interface FormErrors {
  title?: string;
  content?: string;
}

// Import NoteTag type from our model
import type { NoteTag } from "../models/NoteTag";

const CreateNotePage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { theme } = useTheme();

  // Form state
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // UI state
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [availableTags, setAvailableTags] = useState<NoteTag[]>([]);
  const [isLoadingTags, setIsLoadingTags] = useState<boolean>(false);

  // Editor theme
  const editorTheme = theme.palette.mode === "dark" ? "vs-dark" : "vs-light";

  // Fetch available tags
  useEffect(() => {
    const fetchTags = async () => {
      try {
        setIsLoadingTags(true);
        const tags = await getTags();
        // Set the tags received from the backend
        setAvailableTags(tags);
      } catch (error) {
        console.error("Failed to load tags:", error);
        showToast("error", "Failed to load available tags.", 3000);
      } finally {
        setIsLoadingTags(false);
      }
    };

    fetchTags();
  }, [showToast]);

  // Form validation
  const validateForm = () => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!title.trim()) {
      newErrors.title = "Title is required";
      isValid = false;
    }

    if (!content.trim()) {
      newErrors.content = "Content is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      const newNote = await createNote({
        title,
        description,
        content,
        tags: selectedTags,
      });

      showToast("success", "Note created successfully!", 3000);

      navigate(`/note/${newNote.id}`);
    } catch (error) {
      console.error("Failed to create note:", error);
      showToast("error", "Failed to create note. Please try again.", 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle tag toggle
  const handleTagToggle = (tagName: string) => {
    setSelectedTags((prev) => {
      if (prev.includes(tagName)) {
        return prev.filter((t) => t !== tagName);
      } else {
        return [...prev, tagName];
      }
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: 2,
          mb: 4,
        }}
      >
        <Box display="flex" alignItems="center" mb={3}>
          <IconButton
            onClick={() => navigate("/")}
            color="primary"
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>

          <Typography
            variant="h4"
            component="h1"
            fontWeight="bold"
            color="primary"
          >
            Create New Note
          </Typography>
        </Box>

        <Divider sx={{ mb: 4 }} />

        <Stack spacing={3}>
          {/* Title Field */}
          <Box display="flex" alignItems="flex-start">
            <TitleIcon sx={{ mt: 2, mr: 2, color: "primary.main" }} />
            <TextField
              fullWidth
              id="title"
              label="Title"
              variant="outlined"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={!!errors.title}
              helperText={errors.title}
              placeholder="Enter a descriptive title"
              InputProps={{
                sx: { borderRadius: 1.5 },
              }}
            />
          </Box>

          {/* Description Field */}
          <Box display="flex" alignItems="flex-start">
            <DescriptionIcon sx={{ mt: 2, mr: 2, color: "primary.main" }} />
            <TextField
              fullWidth
              id="description"
              label="Brief Description (optional)"
              variant="outlined"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description of what this note contains"
              InputProps={{
                sx: { borderRadius: 1.5 },
              }}
            />
          </Box>

          {/* Tags Selection - Horizontal Multi-Select */}
          <Box display="flex" alignItems="flex-start">
            <LabelIcon sx={{ mt: 2, mr: 2, color: "primary.main" }} />
            <Box sx={{ width: "100%" }}>
              <Typography variant="subtitle1" gutterBottom>
                Tags
              </Typography>
              {isLoadingTags ? (
                <Box display="flex" justifyContent="center" my={2}>
                  <CircularProgress size={24} />
                </Box>
              ) : (
                <>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 1,
                      mb: 2,
                      maxHeight: "200px",
                      overflowY: "auto",
                      p: 1,
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 1,
                    }}
                  >
                    {availableTags.map((tag) => (
                      <Chip
                        key={tag.name}
                        label={
                          tag.emoji && tag.displayName
                            ? `${tag.emoji} ${tag.displayName}`
                            : tag.name
                        }
                        color={
                          selectedTags.includes(tag.name)
                            ? "primary"
                            : "default"
                        }
                        onClick={() => handleTagToggle(tag.name)}
                        sx={{
                          "&:hover": {
                            bgcolor: selectedTags.includes(tag.name)
                              ? "primary.main"
                              : "action.hover",
                          },
                          transition: "all 0.2s",
                        }}
                      />
                    ))}
                  </Box>
                  <FormHelperText>
                    Click to select multiple tags for your note
                  </FormHelperText>
                </>
              )}
            </Box>
          </Box>

          {/* Content Editor */}
          <Box sx={{ mt: 2 }}>
            <Box display="flex" alignItems="center" mb={1}>
              <CodeIcon sx={{ mr: 1, color: "primary.main" }} />
              <Typography variant="h6" component="h3" color="primary">
                Content
              </Typography>
              <Tooltip title="You can use markdown or code with syntax highlighting">
                <IconButton size="small" sx={{ ml: 1 }}>
                  <HelpOutlineIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>

            <Card
              variant="outlined"
              sx={{
                height: "400px",
                border: errors.content
                  ? `2px solid ${theme.palette.error.main}`
                  : undefined,
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <Editor
                height="100%"
                defaultLanguage="markdown"
                theme={editorTheme}
                value={content}
                onChange={(value) => setContent(value || "")}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  wordWrap: "on",
                  lineNumbers: "on",
                  folding: true,
                  scrollBeyondLastLine: false,
                }}
              />
            </Card>

            {errors.content && (
              <FormHelperText error>{errors.content}</FormHelperText>
            )}
          </Box>

          {/* Form Actions */}
          <Box display="flex" justifyContent="flex-end" gap={2} mt={4}>
            <Button
              variant="outlined"
              onClick={() => navigate("/")}
              startIcon={<ArrowBackIcon />}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={isSubmitting}
              startIcon={
                isSubmitting ? <CircularProgress size={20} /> : <SaveIcon />
              }
              sx={{
                px: 3,
                py: 1,
                borderRadius: 1.5,
              }}
            >
              {isSubmitting ? "Saving..." : "Save Note"}
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
};

export default CreateNotePage;
