/**
 * FeatureDemoPage.tsx
 *
 * Showcases all the enhanced components and features of CodeBoard:
 * - Toast notifications system with different types
 * - Loading spinners with variable sizes and messages
 * - Code syntax highlighting with language detection
 * - Enhanced settings panel with theme control
 * - Responsive design patterns
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CodeHighlighter from "../components/ui/CodeHighlighter";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { useToast } from "../components/ToastProvider";
import EnhancedSettingsPanel from "../components/EnhancedSettingsPanel";
import { useTheme } from "../theme/ThemeContext";

// Material UI Components
import {
  Box,
  Typography,
  Paper,
  Container,
  Button,
  Tabs,
  Tab,
  Card,
  CardContent,
  Grid,
  Divider,
  IconButton,
  Stack,
  useTheme as useMuiTheme,
} from "@mui/material";

// Material UI icons
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SettingsIcon from "@mui/icons-material/Settings";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const FeatureDemoPage: React.FC = () => {
  const navigate = useNavigate();
  const muiTheme = useMuiTheme();
  const [showSettings, setShowSettings] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "frontend" | "backend" | "python" | "database"
  >("frontend");
  const { showToast } = useToast();

  const cardStyle = {
    height: "100%",
    transition: muiTheme.transitions.create(["transform", "box-shadow"]),
    backgroundColor: muiTheme.palette.background.paper,
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: muiTheme.shadows[2],
    },
  };

  const codeBlockStyle = {
    borderRadius: 1,
    overflow: "hidden",
    boxShadow: muiTheme.shadows[1],
    "& pre": {
      m: 0,
      p: 2,
      backgroundColor:
        muiTheme.palette.mode === "dark"
          ? "rgba(0, 0, 0, 0.2)"
          : "rgba(0, 0, 0, 0.04)",
    },
  };

  const sampleCode = `// Welcome to CodeBoard - Enhanced Edition!
import React, { useState } from 'react';
import { createNote } from '../services/codeboardApi';
import { useToast } from '../components/ToastProvider';

const ExampleComponent: React.FC = () => {
  const [notes, setNotes] = useState([]);
  const { showToast } = useToast();

  const handleCreateNote = async (noteData) => {
    try {
      const newNote = await createNote(noteData);
      setNotes(prev => [...prev, newNote]);
      
      // Show success toast
      showToast('success', 'Note created successfully!');
    } catch (error) {
      showToast('error', 'Failed to create note');
    }
  };

  return (
    <div className="note-container">
      <h1>My Code Notes</h1>
      {/* Render notes here */}
    </div>
  );
};

export default ExampleComponent;`;

  const javaCode = `// Java Example with Spring Boot
@RestController
@RequestMapping("/api/codenotes")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class CodeNoteController {
    
    private final CodeNoteService codeNoteService;
    
    public CodeNoteController(CodeNoteService service) {
        this.codeNoteService = service;
    }
    
    @GetMapping
    public ResponseEntity<List<CodeNote>> getAllNotes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Page<CodeNote> notePage = codeNoteService.findAll(
            PageRequest.of(page, size)
        );
        
        return ResponseEntity.ok(notePage.getContent());
    }
    
    @PostMapping
    public ResponseEntity<CodeNote> createNote(
            @Valid @RequestBody CodeNote note) {
        
        CodeNote savedNote = codeNoteService.save(note);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedNote);
    }
}`;

  const pythonCode = `# Python Data Science Example
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import matplotlib.pyplot as plt

def analyze_code_notes_data():
    """
    Analyze patterns in code notes usage
    """
    # Load the data
    df = pd.read_csv('codeboard_usage.csv')
    
    # Feature engineering
    df['notes_per_day'] = df.groupby('date')['note_id'].transform('count')
    df['avg_content_length'] = df['content'].str.len()
    
    # Prepare features
    features = ['notes_per_day', 'avg_content_length', 'tag_count']
    X = df[features]
    y = df['user_active']
    
    # Train model
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    # Feature importance
    importance = pd.DataFrame({
        'feature': features,
        'importance': model.feature_importances_
    }).sort_values('importance', ascending=False)
    
    return model, importance

# Run analysis
model, feature_importance = analyze_code_notes_data()
print("Feature Importance:")
print(feature_importance)`;

  const sqlCode = `-- Advanced SQL Queries for CodeBoard Analytics
-- Get most popular programming languages
WITH language_stats AS (
    SELECT 
        LOWER(TRIM(language)) as lang,
        COUNT(*) as snippet_count,
        COUNT(DISTINCT note_id) as notes_with_language,
        AVG(LENGTH(content)) as avg_content_length
    FROM 
        code_snippets
    WHERE 
        created_at >= NOW() - INTERVAL '30 days'
        AND language IS NOT NULL
    GROUP BY 
        LOWER(TRIM(language))
),
ranked_langs AS (
    SELECT 
        lang,
        snippet_count,
        notes_with_language,
        avg_content_length,
        RANK() OVER (ORDER BY snippet_count DESC) as popularity_rank
    FROM 
        language_stats
)
SELECT 
    lang as "Language",
    snippet_count as "Total Snippets",
    notes_with_language as "Notes Count",
    ROUND(avg_content_length, 2) as "Avg. Length",
    popularity_rank as "Rank"
FROM 
    ranked_langs
WHERE 
    popularity_rank <= 10
ORDER BY 
    popularity_rank;`;

  const handleTabChange = (
    _event: React.SyntheticEvent,
    newValue: "frontend" | "backend" | "python" | "database"
  ) => {
    setActiveTab(newValue);
  };

  const handleShowLoading = () => {
    setShowLoading(true);
    setTimeout(() => setShowLoading(false), 3000);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {showSettings && (
        <EnhancedSettingsPanel
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
        />
      )}

      <Paper
        elevation={1}
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: 2,
          mb: 4,
          backgroundColor: (theme) => theme.palette.background.paper,
          transition: (theme) => theme.transitions.create(["box-shadow"]),
          "&:hover": {
            boxShadow: (theme) => theme.shadows[2],
          },
        }}
      >
        <Box display="flex" alignItems="center" mb={3}>
          <IconButton
            onClick={() => navigate("/about")}
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
            Feature Demo
          </Typography>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* Demo Introduction */}
        <Typography variant="body1" paragraph>
          Welcome to the CodeBoard Feature Demonstration. This page showcases
          the various components, UI elements, and interactions available in the
          application. Use this as a reference for integrating these features
          into your own views.
        </Typography>

        {/* Loading Spinner Demo */}
        {showLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              mt: 4,
              mb: 4,
              height: 200,
            }}
          >
            <LoadingSpinner size="large" />
            <Typography variant="body2" sx={{ mt: 2 }}>
              Loading Demo (3 seconds)...
            </Typography>
          </Box>
        ) : (
          <Box sx={{ mt: 2, mb: 4 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleShowLoading}
              startIcon={<PlayArrowIcon />}
            >
              Show Loading Demo
            </Button>
          </Box>
        )}

        {/* Toast Notifications Demo */}
        <Box sx={{ mt: 6, mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 2 }} color="primary">
            Toast Notifications
          </Typography>
          <Divider sx={{ mb: 3 }} />
        </Box>

        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item>
            <Button
              variant="outlined"
              startIcon={<NotificationsIcon />}
              onClick={() =>
                showToast("success", "Operation completed successfully!")
              }
            >
              Success Toast
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              startIcon={<NotificationsIcon />}
              onClick={() =>
                showToast("error", "An error occurred during the operation.")
              }
            >
              Error Toast
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              startIcon={<NotificationsIcon />}
              onClick={() =>
                showToast("warning", "This action may have consequences.")
              }
            >
              Warning Toast
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              startIcon={<NotificationsIcon />}
              onClick={() =>
                showToast("info", "Here's some useful information.")
              }
            >
              Info Toast
            </Button>
          </Grid>
        </Grid>

        {/* Settings Demo */}
        <Box sx={{ mt: 6, mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 2 }} color="primary">
            Settings Panel
          </Typography>
          <Divider sx={{ mb: 3 }} />
        </Box>

        <Box sx={{ mb: 4 }}>
          <Button
            variant="outlined"
            onClick={() => setShowSettings(true)}
            startIcon={<SettingsIcon />}
          >
            Open Settings Panel
          </Button>
        </Box>

        {/* Code Highlighting Demo */}
        <Box sx={{ mt: 6, mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 2 }} color="primary">
            Code Highlighting
          </Typography>
          <Divider sx={{ mb: 3 }} />
        </Box>

        <Box sx={{ mb: 4 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            textColor="primary"
            indicatorColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              mb: 2,
              borderBottom: 1,
              borderColor: "divider",
              minHeight: 48,
              "& .MuiTab-root": {
                minHeight: 48,
                textTransform: "none",
                fontSize: "0.9rem",
                fontWeight: 500,
              },
            }}
          >
            <Tab value="frontend" label="Frontend" />
            <Tab value="backend" label="Backend" />
            <Tab value="python" label="Python" />
            <Tab value="database" label="Database" />
          </Tabs>

          <Box sx={codeBlockStyle}>
            {activeTab === "frontend" && (
              <CodeHighlighter
                code={sampleCode}
                showHeader={true}
                tag="FRONTEND"
              />
            )}

            {activeTab === "backend" && (
              <CodeHighlighter
                code={javaCode}
                showHeader={true}
                tag="BACKEND"
              />
            )}

            {activeTab === "python" && (
              <CodeHighlighter
                code={pythonCode}
                showHeader={true}
                tag="ALGORITHM"
              />
            )}

            {activeTab === "database" && (
              <CodeHighlighter
                code={sqlCode}
                showHeader={true}
                tag="DATABASE"
              />
            )}
          </Box>
        </Box>

        {/* Features Grid */}
        <Box sx={{ mt: 6, mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 2 }} color="primary">
            Enhanced Features
          </Typography>
          <Divider sx={{ mb: 3 }} />
        </Box>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6} lg={4}>
            <Card variant="outlined" sx={cardStyle}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Toast Notifications
                </Typography>
                <Typography variant="body2">
                  Customizable toast notification system with success, error,
                  warning, and info variants. Auto-dismiss and action support.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <Card variant="outlined" sx={cardStyle}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Code Syntax Highlighting
                </Typography>
                <Typography variant="body2">
                  Beautiful code highlighting with support for multiple
                  programming languages, themes, and customizable appearance.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <Card variant="outlined" sx={cardStyle}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Theme System
                </Typography>
                <Typography variant="body2">
                  Fully customizable theme with light and dark mode support,
                  accent colors, and consistent styling across components.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <Card variant="outlined" sx={cardStyle}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Loading States
                </Typography>
                <Typography variant="body2">
                  Elegant loading spinners, skeletons, and progress indicators
                  for different loading scenarios and contexts.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <Card variant="outlined" sx={cardStyle}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Settings Management
                </Typography>
                <Typography variant="body2">
                  Robust settings panel for configuring application preferences,
                  theme options, and user-specific settings.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <Card variant="outlined" sx={cardStyle}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Responsive Design
                </Typography>
                <Typography variant="body2">
                  Fully responsive layout that adapts to different screen sizes
                  and devices for optimal user experience.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Return to About Button */}
        <Box sx={{ mt: 5, textAlign: "center" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/about")}
            startIcon={<ArrowBackIcon />}
          >
            Return to About
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default FeatureDemoPage;
