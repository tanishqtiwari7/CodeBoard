/**
 * NoteDetailPage.tsx
 *
 * Modern implementation of note detail page with:
 * - Modern React patterns with TypeScript
 * - Material UI components
 * - Code editor with syntax highlighting
 * - Enhanced tag management
 * - Responsive design
 * - Optimized state management
 */

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getNoteById,
  updateNote,
  incrementNoteViewCount,
  type CodeNote,
} from "../services/codeboardApi";
import { useToast } from "../components/ToastProvider";
import { useTheme } from "@mui/material/styles";
import {
  getLanguageName,
  getLanguageDisplayName,
} from "../utils/highlightLanguageDetector";
import HorizontalTagSelector from "../components/HorizontalTagSelector";
import { getTagDisplayName, getTagEmoji } from "../constants/tags";

// Material UI Components
import {
  Box,
  Typography,
  Button,
  Chip,
  Container,
  Paper,
  TextField,
  Skeleton,
  Divider,
  Grid,
  Card,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
} from "@mui/material";

// Material UI Icons
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import CodeIcon from "@mui/icons-material/Code";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import TitleIcon from "@mui/icons-material/Title";
import DescriptionIcon from "@mui/icons-material/Description";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

// Code Editor & Syntax Highlighter
import Editor from "@monaco-editor/react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  vscDarkPlus,
  vs,
} from "react-syntax-highlighter/dist/esm/styles/prism";

// Interface for form errors
interface FormErrors {
  title?: string;
  content?: string;
}

// Interface for form data
interface EditFormData {
  title: string;
  description: string;
  content: string;
  tags: string[];
}

const NoteDetailPage: React.FC = () => {
  // Routing and navigation
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // State management
  const [note, setNote] = useState<CodeNote | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editForm, setEditForm] = useState<EditFormData>({
    title: "",
    description: "",
    content: "",
    tags: [],
  });
  const [saving, setSaving] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [activeTab, setActiveTab] = useState<number>(0);

  // Hooks
  const { showToast } = useToast();
  const theme = useTheme();

  // Editor theme based on app theme
  const editorTheme = theme.palette.mode === "dark" ? "vs-dark" : "vs-light";
  const syntaxTheme = theme.palette.mode === "dark" ? vscDarkPlus : vs;

  // Fetch note data
  const fetchNoteData = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      const noteData = await getNoteById(parseInt(id));

      // Increment view count
      incrementNoteViewCount(parseInt(id)).catch((err) => {
        console.warn("Failed to increment view count:", err);
      });

      setNote(noteData);

      // For existing notes where content is null/empty but description has code content,
      // we need to handle this migration during editing
      const hasContentInDescription =
        noteData.description &&
        (!noteData.content || noteData.content.trim() === "");

      setEditForm({
        title: noteData.title || "",
        description: hasContentInDescription ? "" : noteData.description || "",
        content:
          noteData.content ||
          (hasContentInDescription ? noteData.description || "" : ""),
        tags: Array.isArray(noteData.tags) ? noteData.tags : [],
      });
    } catch (err) {
      console.error("Error fetching note:", err);
      setError(
        "Could not load note. Please make sure your backend is running correctly."
      );
      setNote(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Initial data fetching
  useEffect(() => {
    fetchNoteData();
  }, [fetchNoteData]);

  // Form validation
  const validateForm = () => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!editForm.title.trim()) {
      newErrors.title = "Title is required";
      isValid = false;
    }

    if (!editForm.content.trim()) {
      newErrors.content = "Content is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle edit button click
  const handleEdit = () => {
    setIsEditing(true);
  };

  // Handle save button click
  const handleSave = async () => {
    if (!id || !validateForm()) return;

    try {
      setSaving(true);

      const updatedNote = await updateNote(Number(id), {
        title: editForm.title,
        description: editForm.description,
        content: editForm.content,
        tags: editForm.tags,
      });

      setNote(updatedNote);
      setIsEditing(false);

      showToast("success", "Your note has been updated successfully.", 3000);
    } catch (err) {
      console.error("Error updating note:", err);
      showToast("error", "Failed to update note. Please try again.", 5000);
    } finally {
      setSaving(false);
    }
  };

  // Handle cancel button click
  const handleCancel = () => {
    if (!note) return;

    // Reset form to current note values
    const hasContentInDescription =
      note.description && (!note.content || note.content.trim() === "");

    setEditForm({
      title: note.title || "",
      description: hasContentInDescription ? "" : note.description || "",
      content:
        note.content || (hasContentInDescription ? note.description || "" : ""),
      tags: Array.isArray(note.tags) ? note.tags : [],
    });

    setErrors({});
    setIsEditing(false);
  };

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Detect language from content
  const getLanguage = (content?: string): string => {
    if (!content || content.trim() === "") return "text";
    return getLanguageName(content);
  };

  // Format date for display
  const formatDate = (dateString?: string): string => {
    if (!dateString) return "Unknown date";
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      return "Invalid date";
    }
  };

  // Render loading state
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Box sx={{ mb: 3 }}>
          <Skeleton
            variant="rectangular"
            width={120}
            height={36}
            sx={{ borderRadius: 1 }}
          />
        </Box>

        <Paper sx={{ p: { xs: 2, sm: 4 }, borderRadius: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Skeleton
              variant="rectangular"
              width="70%"
              height={40}
              sx={{ mb: 1 }}
            />
            <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
              <Skeleton
                variant="rectangular"
                width={100}
                height={28}
                sx={{ borderRadius: 4 }}
              />
              <Skeleton
                variant="rectangular"
                width={80}
                height={28}
                sx={{ borderRadius: 4 }}
              />
            </Box>
            <Skeleton variant="text" width="50%" />
          </Box>

          <Skeleton
            variant="rectangular"
            height={300}
            sx={{ borderRadius: 2 }}
          />
        </Paper>
      </Container>
    );
  }

  // Render error state
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Alert
          severity="error"
          variant="filled"
          action={
            <Button color="inherit" size="small" onClick={() => navigate("/")}>
              Back to Home
            </Button>
          }
          sx={{ mb: 2, borderRadius: 2 }}
        >
          {error}
        </Alert>
      </Container>
    );
  }

  // Main component render
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 } }}>
      {/* Back button */}
      <Box sx={{ mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/")}
          sx={{ borderRadius: 2 }}
        >
          Back to Notes
        </Button>
      </Box>

      {note && (
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, sm: 4 },
            borderRadius: 3,
            transition: "all 0.3s ease",
          }}
        >
          {/* View Mode */}
          {!isEditing ? (
            <>
              <Box
                sx={{ mb: 4, pb: 3, borderBottom: 1, borderColor: "divider" }}
              >
                {/* Tags and Language */}
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                  {/* Language chip */}
                  <Chip
                    icon={<CodeIcon />}
                    label={getLanguageDisplayName(
                      note.content || note.description || ""
                    )}
                    color="primary"
                    variant="filled"
                    size="small"
                    sx={{ borderRadius: 2 }}
                  />

                  {/* User tags */}
                  {Array.isArray(note.tags) &&
                    note.tags.length > 0 &&
                    note.tags.map((tag: string, index: number) => (
                      <Chip
                        key={index}
                        label={
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <span>{getTagEmoji(tag)}</span>
                            <span>{getTagDisplayName(tag)}</span>
                          </Box>
                        }
                        color="secondary"
                        variant="filled"
                        size="small"
                        sx={{ borderRadius: 2 }}
                      />
                    ))}
                </Box>

                {/* Title and Edit button */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                    gap: 2,
                    mb: 1,
                  }}
                >
                  <Typography
                    variant="h4"
                    component="h1"
                    fontWeight="bold"
                    color="primary"
                    sx={{ flexGrow: 1 }}
                  >
                    {note.title}
                  </Typography>

                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<EditIcon />}
                    onClick={handleEdit}
                    sx={{ borderRadius: 2, whiteSpace: "nowrap" }}
                  >
                    Edit
                  </Button>
                </Box>

                {/* Description */}
                {note.description && (
                  <Typography
                    variant="body1"
                    sx={{
                      fontStyle: "italic",
                      mb: 1,
                      color: "text.secondary",
                    }}
                  >
                    {note.description}
                  </Typography>
                )}

                {/* Metadata */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 3,
                    mt: 2,
                    color: "text.secondary",
                    fontSize: "0.9rem",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <CalendarTodayIcon fontSize="small" />
                    <Typography variant="body2">
                      Created: {formatDate(note.createdAt)}
                    </Typography>
                  </Box>

                  {note.updatedAt && note.updatedAt !== note.createdAt && (
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <EditIcon fontSize="small" />
                      <Typography variant="body2">
                        Updated: {formatDate(note.updatedAt)}
                      </Typography>
                    </Box>
                  )}

                  {note.viewCount !== undefined && (
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <VisibilityIcon fontSize="small" />
                      <Typography variant="body2">
                        Views: {note.viewCount}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>

              {/* Content */}
              <Box sx={{ mb: 3 }}>
                <Card
                  variant="outlined"
                  sx={{
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                >
                  <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    sx={{ borderBottom: 1, borderColor: "divider" }}
                  >
                    <Tab
                      icon={<CodeIcon fontSize="small" />}
                      iconPosition="start"
                      label="Code"
                    />
                  </Tabs>

                  <Box
                    sx={{
                      p: 0,
                      "& pre": {
                        m: 0,
                        borderRadius: 0,
                      },
                    }}
                  >
                    <SyntaxHighlighter
                      language={getLanguage(note.content || note.description)}
                      style={syntaxTheme}
                      customStyle={{
                        margin: 0,
                        borderRadius: 0,
                        padding: "1.5rem",
                        minHeight: "200px",
                      }}
                    >
                      {note.content ||
                        note.description ||
                        "// No content available yet. Click 'Edit' to add some code!"}
                    </SyntaxHighlighter>
                  </Box>
                </Card>

                <Box
                  sx={{
                    mt: 3,
                    p: 2,
                    bgcolor:
                      theme.palette.mode === "dark"
                        ? "rgba(255, 255, 255, 0.05)"
                        : "rgba(0, 0, 0, 0.02)",
                    borderRadius: 2,
                    textAlign: "center",
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    💡 <strong>Tip:</strong> You can copy the code above and
                    paste it anywhere you need!
                  </Typography>
                </Box>
              </Box>
            </>
          ) : (
            /* Edit Mode */
            <Box component="form" noValidate>
              <Typography
                variant="h5"
                component="h2"
                color="primary"
                fontWeight="bold"
                sx={{ mb: 3 }}
              >
                ✏️ Edit Note
              </Typography>

              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={3}>
                {/* Title Field */}
                <Grid item xs={12}>
                  <Box display="flex" alignItems="flex-start">
                    <TitleIcon sx={{ mt: 2, mr: 2, color: "primary.main" }} />
                    <TextField
                      fullWidth
                      required
                      id="title"
                      label="Title"
                      value={editForm.title}
                      onChange={(e) =>
                        setEditForm({ ...editForm, title: e.target.value })
                      }
                      error={!!errors.title}
                      helperText={errors.title}
                      InputProps={{
                        sx: { borderRadius: 1.5 },
                      }}
                    />
                  </Box>
                </Grid>

                {/* Description Field */}
                <Grid item xs={12}>
                  <Box display="flex" alignItems="flex-start">
                    <DescriptionIcon
                      sx={{ mt: 2, mr: 2, color: "primary.main" }}
                    />
                    <TextField
                      fullWidth
                      id="description"
                      label="Brief Description (optional)"
                      value={editForm.description}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          description: e.target.value,
                        })
                      }
                      InputProps={{
                        sx: { borderRadius: 1.5 },
                      }}
                    />
                  </Box>
                </Grid>

                {/* Tags Field */}
                <Grid item xs={12}>
                  <Box display="flex" alignItems="flex-start">
                    <LocalOfferIcon
                      sx={{ mt: 2, mr: 2, color: "primary.main" }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <HorizontalTagSelector
                        selectedTags={editForm.tags}
                        onTagChange={(tags) =>
                          setEditForm({ ...editForm, tags })
                        }
                      />
                    </Box>
                  </Box>
                </Grid>

                {/* Content Field */}
                <Grid item xs={12}>
                  <Box sx={{ mb: 1 }}>
                    <Box display="flex" alignItems="center">
                      <CodeIcon sx={{ mr: 1, color: "primary.main" }} />
                      <Typography variant="h6" component="h3" color="primary">
                        Content
                      </Typography>
                    </Box>
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
                      defaultLanguage={getLanguage(editForm.content)}
                      language={getLanguage(editForm.content)}
                      theme={editorTheme}
                      value={editForm.content}
                      onChange={(value) =>
                        setEditForm({ ...editForm, content: value || "" })
                      }
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
                    <Typography variant="caption" color="error">
                      {errors.content}
                    </Typography>
                  )}
                </Grid>

                {/* Form Actions */}
                <Grid item xs={12}>
                  <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
                    <Button
                      variant="outlined"
                      startIcon={<CancelIcon />}
                      onClick={handleCancel}
                      disabled={saving}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={
                        saving ? <CircularProgress size={20} /> : <SaveIcon />
                      }
                      onClick={handleSave}
                      disabled={saving}
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </Paper>
      )}
    </Container>
  );
};

export default NoteDetailPage;
