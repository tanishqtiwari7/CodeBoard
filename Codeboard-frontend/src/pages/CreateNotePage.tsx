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

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createNote } from "../services/codeboardApi";
import { useToast } from "../components/ToastProvider";
import { useTheme } from "@mui/material/styles";
import HorizontalTagSelector from "../components/HorizontalTagSelector";

// Material UI Components
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Container,
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

// Using NoteTag type from the API service

const CreateNotePage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const theme = useTheme();

  // Form state
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // UI state
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Editor theme
  const editorTheme = theme.palette.mode === "dark" ? "vs-dark" : "vs-light";

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
              <HorizontalTagSelector
                selectedTags={selectedTags}
                onTagChange={setSelectedTags}
              />
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
