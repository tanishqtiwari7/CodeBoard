/**
 * HomePage.tsx - Main landing page for CodeBoard
 *
 * Modern implementation with:
 * - TypeScript interfaces for proper type safety
 * - React hooks for state management
 * - Modern component patterns
 * - Centralized API calls with error handling
 * - Responsive design with MUI components
 * - Accessible UI elements
 */

// Components and hooks
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getNotes, deleteNote, type CodeNote } from "../services/codeboardApi";
import { useTheme } from "@mui/material/styles";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../components/ToastProvider";

// Material UI Components
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Skeleton,
  Alert,
  TextField,
  InputAdornment,
} from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";

// Material UI Icons
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import SearchIcon from "@mui/icons-material/Search";
import CodeIcon from "@mui/icons-material/Code";
import VisibilityIcon from "@mui/icons-material/Visibility";

// Language detection utility
import { detectLanguage } from "../utils/languageDetector";

// Component interfaces
interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

interface NoteCardProps {
  note: CodeNote;
  onDelete: (id: number, title: string, e: React.MouseEvent) => void;
  onView: (id: number) => void;
  sx?: SxProps<Theme>;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  message,
  onConfirm,
  onCancel,
}) => (
  <Dialog
    open={open}
    onClose={onCancel}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
    PaperProps={{
      sx: {
        borderRadius: 3,
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
        overflow: "hidden",
      },
    }}
  >
    <DialogTitle
      id="alert-dialog-title"
      sx={{
        borderBottom: "1px solid",
        borderColor: "divider",
        py: 2,
      }}
    >
      {title}
    </DialogTitle>
    <DialogContent sx={{ pt: 3, pb: 2 }}>
      <DialogContentText id="alert-dialog-description">
        {message}
      </DialogContentText>
    </DialogContent>
    <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
      <Button
        onClick={onCancel}
        variant="outlined"
        color="inherit"
        sx={{ borderRadius: "28px", fontWeight: 500, px: 3 }}
      >
        Cancel
      </Button>
      <Button
        onClick={onConfirm}
        variant="contained"
        color="error"
        autoFocus
        sx={{ borderRadius: "28px", fontWeight: 500, px: 3 }}
      >
        Delete
      </Button>
    </DialogActions>
  </Dialog>
);

const NoteCard: React.FC<NoteCardProps> = ({ note, onDelete, onView, sx }) => {
  const { title, description, content, tags = [], id } = note;
  const language = detectLanguage(content || "");
  const theme = useTheme();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(id, title, e);
  };

  const handleView = () => {
    onView(id);
  };

  return (
    <Card
      component={motion.div}
      whileHover={{
        scale: 1.02,
        boxShadow:
          theme.palette.mode === "dark"
            ? "0 10px 30px rgba(0, 0, 0, 0.25)"
            : "0 10px 30px rgba(165, 138, 117, 0.15)",
      }}
      transition={{ type: "spring", stiffness: 300 }}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        borderRadius: 4,
        overflow: "hidden",
        border: "1px solid",
        borderColor:
          theme.palette.mode === "dark"
            ? "rgba(80, 70, 60, 0.2)"
            : "rgba(230, 213, 197, 0.5)",
        backgroundColor:
          theme.palette.mode === "dark"
            ? "rgba(42, 37, 32, 0.5)"
            : "rgba(255, 251, 244, 0.7)",
        backdropFilter: "blur(8px)",
        transition: "all 0.3s ease",
        ...sx,
      }}
      onClick={handleView}
      elevation={0}
    >
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Box
          sx={{
            mb: 2,
            pb: 2,
            borderBottom: "1px solid",
            borderColor:
              theme.palette.mode === "dark"
                ? "rgba(80, 70, 60, 0.2)"
                : "rgba(230, 213, 197, 0.5)",
          }}
        >
          <Typography
            variant="h6"
            component="h2"
            gutterBottom
            sx={{
              fontWeight: 600,
              color: theme.palette.primary.main,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              mb: 1,
            }}
          >
            {title}
          </Typography>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.7, mb: 1 }}>
            {language && (
              <Chip
                label={language}
                size="small"
                icon={<CodeIcon sx={{ fontSize: "0.9rem" }} />}
                color="primary"
                variant="filled"
                sx={{
                  borderRadius: "16px",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(231, 171, 121, 0.8)"
                      : undefined,
                }}
              />
            )}
            {tags.slice(0, 3).map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                icon={<LocalOfferIcon sx={{ fontSize: "0.9rem" }} />}
                onClick={(e) => e.stopPropagation()}
                sx={{
                  borderRadius: "16px",
                  fontSize: "0.75rem",
                  bgcolor:
                    theme.palette.mode === "dark"
                      ? "rgba(74, 63, 53, 0.6)"
                      : "rgba(180, 132, 108, 0.1)",
                  color:
                    theme.palette.mode === "dark"
                      ? "rgba(245, 240, 232, 0.8)"
                      : theme.palette.secondary.main,
                }}
              />
            ))}
            {tags.length > 3 && (
              <Chip
                label={`+${tags.length - 3}`}
                size="small"
                sx={{
                  borderRadius: "16px",
                  fontSize: "0.75rem",
                  bgcolor:
                    theme.palette.mode === "dark"
                      ? "rgba(74, 63, 53, 0.4)"
                      : "rgba(180, 132, 108, 0.05)",
                }}
              />
            )}
          </Box>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            mb: 1,
            fontSize: "0.875rem",
            lineHeight: 1.5,
          }}
        >
          {description || "No description provided"}
        </Typography>
      </CardContent>

      <CardActions
        sx={{
          borderTop: "1px solid",
          borderColor:
            theme.palette.mode === "dark"
              ? "rgba(80, 70, 60, 0.2)"
              : "rgba(230, 213, 197, 0.5)",
          p: 1.5,
          px: 2,
          backgroundColor:
            theme.palette.mode === "dark"
              ? "rgba(42, 37, 32, 0.4)"
              : "rgba(245, 231, 211, 0.3)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <Button
            size="small"
            variant="text"
            startIcon={<VisibilityIcon />}
            onClick={handleView}
            sx={{
              fontWeight: 500,
              color: theme.palette.primary.main,
            }}
          >
            View
          </Button>
          <Button
            size="small"
            variant="text"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDelete}
            sx={{ fontWeight: 500 }}
          >
            Delete
          </Button>
        </Box>
      </CardActions>
    </Card>
  );
};

// Main HomePage component
const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const theme = useTheme();

  // State
  const [notes, setNotes] = useState<CodeNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<{
    id: number;
    title: string;
  } | null>(null);

  // Fetch notes
  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedNotes = await getNotes();
      setNotes(fetchedNotes);
    } catch (err) {
      const isServerDown =
        err instanceof Error &&
        (err.message.includes("Backend server is not running") ||
          err.message.includes("ECONNREFUSED") ||
          err.message.includes("Network Error") ||
          err.message.includes("Failed to fetch"));

      const errorMessage = isServerDown
        ? "Backend server is not running. Please start the server and try again."
        : err instanceof Error
          ? err.message
          : "Failed to fetch notes";

      setError(errorMessage);
      showToast("error", errorMessage);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // Handle delete
  const handleDeleteClick = (
    id: number,
    title: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    setNoteToDelete({ id, title });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!noteToDelete) return;

    try {
      await deleteNote(noteToDelete.id);
      showToast("success", `Note "${noteToDelete.title}" deleted successfully`);
      fetchNotes();
    } catch (err) {
      showToast("error", "Failed to delete note");
    } finally {
      setDeleteDialogOpen(false);
      setNoteToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setNoteToDelete(null);
  };

  const handleViewNote = (id: number) => {
    navigate(`/note/${id}`);
  };

  // Filter notes based on search query
  const filteredNotes = notes.filter((note) => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase().trim();

    // Safely check title
    const matchesTitle = note.title?.toLowerCase().includes(query) || false;

    // Safely check tags
    const matchesTags =
      Array.isArray(note.tags) && note.tags.length > 0
        ? note.tags.some((tag) => tag?.toLowerCase().includes(query))
        : false;

    // Safely check content
    const matchesContent =
      note.description?.toLowerCase().includes(query) ||
      false ||
      note.content?.toLowerCase().includes(query) ||
      false;

    return matchesTitle || matchesTags || matchesContent;
  });

  // Render loading state
  const renderLoading = () => (
    <Grid container spacing={3}>
      {[1, 2, 3, 4, 5, 6].map((key) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={key}>
          <Box
            sx={{
              borderRadius: 4,
              height: 280,
              p: 0,
              overflow: "hidden",
              position: "relative",
              background:
                theme.palette.mode === "dark"
                  ? "rgba(42, 37, 32, 0.4)"
                  : "rgba(255, 251, 244, 0.7)",
              border: "1px solid",
              borderColor:
                theme.palette.mode === "dark"
                  ? "rgba(80, 70, 60, 0.2)"
                  : "rgba(230, 213, 197, 0.5)",
            }}
          >
            <Skeleton
              variant="rectangular"
              height={50}
              width="70%"
              sx={{
                borderRadius: 1,
                mt: 3,
                ml: 3,
              }}
            />
            <Box sx={{ p: 3, mt: 1 }}>
              <Skeleton
                variant="rectangular"
                height={10}
                width="90%"
                sx={{ borderRadius: 1, mb: 1.5 }}
              />
              <Skeleton
                variant="rectangular"
                height={10}
                width="60%"
                sx={{ borderRadius: 1, mb: 4 }}
              />
              <Skeleton
                variant="rectangular"
                height={100}
                sx={{ borderRadius: 1 }}
              />
              <Box sx={{ display: "flex", mt: 2, gap: 1 }}>
                <Skeleton
                  variant="rectangular"
                  height={24}
                  width={60}
                  sx={{ borderRadius: 4 }}
                />
                <Skeleton
                  variant="rectangular"
                  height={24}
                  width={80}
                  sx={{ borderRadius: 4 }}
                />
              </Box>
            </Box>
          </Box>
        </Grid>
      ))}
    </Grid>
  );

  // Render error state
  const renderError = () => (
    <Box
      textAlign="center"
      py={8}
      px={3}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 4,
        border: "1px dashed",
        borderColor: theme.palette.error.main,
        backgroundColor:
          theme.palette.mode === "dark"
            ? "rgba(216, 88, 88, 0.1)"
            : "rgba(216, 88, 88, 0.05)",
        maxWidth: 600,
        mx: "auto",
      }}
    >
      <Alert
        severity="error"
        variant="outlined"
        sx={{
          mb: 3,
          borderRadius: 3,
          width: "100%",
          maxWidth: 500,
        }}
      >
        {error}
      </Alert>
      <Button
        variant="contained"
        onClick={() => fetchNotes()}
        startIcon={<LibraryBooksIcon />}
        color="error"
        sx={{ px: 3 }}
      >
        Try Again
      </Button>
    </Box>
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        p: { xs: 2, sm: 3 },
        backgroundColor: theme.palette.background.default,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          sx={{
            mb: 5,
            mt: 1,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 700,
                mb: 0.5,
                background:
                  theme.palette.mode === "dark"
                    ? "linear-gradient(90deg, #e7ab79 0%, #b4846c 100%)"
                    : "linear-gradient(90deg, #7d5a50 0%, #b4846c 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              My Code Notes
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: "600px" }}
            >
              Your personal collection of code snippets, ideas, and solutions.
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate("/notes/create")}
            sx={{
              px: 3,
              py: 1,
              fontSize: "1rem",
              boxShadow:
                theme.palette.mode === "dark"
                  ? "none"
                  : "0 8px 16px rgba(125, 90, 80, 0.15)",
              fontWeight: 600,
            }}
          >
            New Note
          </Button>
        </Box>

        <Box
          sx={{
            backgroundColor:
              theme.palette.mode === "dark"
                ? "rgba(42, 37, 32, 0.5)"
                : "rgba(255, 251, 244, 0.6)",
            borderRadius: 4,
            p: 2,
            mb: 4,
            border: `1px solid ${theme.palette.mode === "dark" ? "rgba(80, 70, 60, 0.2)" : "rgba(230, 213, 197, 0.5)"}`,
            backdropFilter: "blur(10px)",
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search notes by title, tags, or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="primary" />
                </InputAdornment>
              ),
              sx: {
                borderRadius: 3,
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "rgba(42, 37, 32, 0.4)"
                    : "rgba(255, 255, 255, 0.6)",
                backdropFilter: "blur(5px)",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor:
                    theme.palette.mode === "dark"
                      ? "rgba(80, 70, 60, 0.3)"
                      : "rgba(230, 213, 197, 0.8)",
                },
              },
            }}
          />
        </Box>
      </motion.div>

      {loading ? (
        renderLoading()
      ) : error ? (
        renderError()
      ) : filteredNotes.length > 0 ? (
        <AnimatePresence>
          <Grid container spacing={3}>
            {filteredNotes.map((note) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={note.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{
                    duration: 0.4,
                    delay: Math.random() * 0.2,
                  }}
                >
                  <NoteCard
                    note={note}
                    onDelete={handleDeleteClick}
                    onView={handleViewNote}
                  />
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </AnimatePresence>
      ) : (
        <Box
          component={motion.div}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          sx={{
            textAlign: "center",
            py: 8,
            px: 3,
            backgroundColor:
              theme.palette.mode === "dark"
                ? "rgba(42, 37, 32, 0.4)"
                : "rgba(255, 251, 244, 0.7)",
            border: "1px dashed",
            borderColor:
              theme.palette.mode === "dark"
                ? "rgba(80, 70, 60, 0.3)"
                : "rgba(230, 213, 197, 0.8)",
            borderRadius: 4,
            maxWidth: 600,
            mx: "auto",
          }}
        >
          <Box
            sx={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              backgroundColor:
                theme.palette.mode === "dark"
                  ? "rgba(231, 171, 121, 0.15)"
                  : "rgba(125, 90, 80, 0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 3,
            }}
          >
            <LibraryBooksIcon
              sx={{
                fontSize: 48,
                color:
                  theme.palette.mode === "dark"
                    ? "rgba(231, 171, 121, 0.7)"
                    : theme.palette.primary.main,
              }}
            />
          </Box>

          <Typography
            variant="h5"
            color="primary"
            gutterBottom
            sx={{ fontWeight: 600 }}
          >
            {searchQuery ? "No matching notes" : "No notes yet"}
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            paragraph
            sx={{ mb: 4, maxWidth: 400, mx: "auto" }}
          >
            {searchQuery
              ? "Try a different search term or clear the search to see all notes."
              : "Get started by creating your first code note. It's easy!"}
          </Typography>

          {!searchQuery && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate("/notes/create")}
              size="large"
              sx={{
                px: 4,
                py: 1,
                fontWeight: 600,
                boxShadow:
                  theme.palette.mode === "dark"
                    ? "none"
                    : "0 8px 16px rgba(125, 90, 80, 0.15)",
              }}
            >
              Create Your First Note
            </Button>
          )}

          {searchQuery && (
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setSearchQuery("")}
              sx={{
                px: 4,
                fontWeight: 500,
              }}
            >
              Clear Search
            </Button>
          )}
        </Box>
      )}

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Note"
        message={`Are you sure you want to delete "${noteToDelete?.title}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </Box>
  );
};

export default HomePage;
