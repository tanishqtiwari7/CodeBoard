/**
 * Elegant Feature Demo Page
 * Showcases the refined design system of CodeBoard
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/ToastProvider";
import { createNote } from "../services/codeboardApi";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  vs,
  vscDarkPlus,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { motion } from "framer-motion";

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
  CircularProgress,
  useTheme,
  Grid,
} from "@mui/material";

import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CodeIcon from "@mui/icons-material/Code";
import PaletteIcon from "@mui/icons-material/Palette";
import SpeedIcon from "@mui/icons-material/Speed";
import SecurityIcon from "@mui/icons-material/Security";

const FeatureDemoPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [isCreating, setIsCreating] = useState(false);

  const sampleCode = {
    javascript: `// JavaScript Example - Elegant & Clean
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));`,

    python: `# Python Example - Beautiful Syntax
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

print(fibonacci(10))`,

    typescript: `// TypeScript Example - Professional Grade
interface User {
  id: number;
  name: string;
  email: string;
}

const createUser = (userData: Omit<User, 'id'>): User => {
  return {
    id: Math.random(),
    ...userData
  };
};`,
  };

  const features = [
    {
      icon: (
        <CodeIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />
      ),
      title: "Elegant Code Management",
      description:
        "Store, organize, and manage your code snippets with a beautiful, professional interface.",
      color: theme.palette.primary.main,
    },
    {
      icon: (
        <PaletteIcon
          sx={{ fontSize: 40, color: theme.palette.secondary.main }}
        />
      ),
      title: "Sophisticated Design",
      description:
        "Enjoy a classy, modern UI that's both functional and visually appealing.",
      color: theme.palette.secondary.main,
    },
    {
      icon: (
        <SpeedIcon
          sx={{ fontSize: 40, color: theme.palette.success?.main || "#4caf50" }}
        />
      ),
      title: "Lightning Fast",
      description:
        "Experience blazing fast performance with smooth animations and interactions.",
      color: theme.palette.success?.main || "#4caf50",
    },
    {
      icon: (
        <SecurityIcon
          sx={{ fontSize: 40, color: theme.palette.warning?.main || "#ff9800" }}
        />
      ),
      title: "Secure & Reliable",
      description:
        "Your code is safe with enterprise-grade security and reliable data management.",
      color: theme.palette.warning?.main || "#ff9800",
    },
  ];

  const handleCreateDemoNote = async () => {
    setIsCreating(true);
    try {
      const selectedLang = Object.keys(sampleCode)[activeTab];
      const selectedCode = sampleCode[selectedLang as keyof typeof sampleCode];

      await createNote({
        title: `${selectedLang.charAt(0).toUpperCase() + selectedLang.slice(1)} Fibonacci Example`,
        description: `Sample ${selectedLang} code demonstrating fibonacci sequence`,
        content: selectedCode,
        tags: ["demo", "fibonacci", selectedLang],
      });

      showToast("success", "Demo note created successfully!");
      navigate("/");
    } catch (error) {
      showToast("error", "Failed to create demo note");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/")}
            sx={{ mb: 2 }}
          >
            Back to Home
          </Button>
          <Typography variant="h2" component="h1" gutterBottom>
            Experience CodeBoard
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Discover the elegant features of our professional code management
            platform
          </Typography>
        </Box>

        {/* Features Grid */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="elegant-card" sx={{ height: "100%" }}>
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      {feature.icon}
                      <Typography
                        variant="h5"
                        component="h3"
                        sx={{ ml: 2, fontWeight: 600 }}
                      >
                        {feature.title}
                      </Typography>
                    </Box>
                    <Typography variant="body1" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Interactive Demo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="elegant-card">
            <CardContent>
              <Typography
                variant="h4"
                component="h2"
                gutterBottom
                sx={{ fontWeight: 600 }}
              >
                Interactive Code Demo
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Try our syntax highlighting with different programming languages
              </Typography>

              <Tabs
                value={activeTab}
                onChange={(_, newValue) => setActiveTab(newValue)}
                sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}
              >
                <Tab label="JavaScript" />
                <Tab label="Python" />
                <Tab label="TypeScript" />
              </Tabs>

              <Paper
                sx={{
                  p: 0,
                  borderRadius: 2,
                  border: 1,
                  borderColor: "divider",
                  overflow: "hidden",
                }}
              >
                <SyntaxHighlighter
                  language={Object.keys(sampleCode)[activeTab]}
                  style={theme.palette.mode === "dark" ? vscDarkPlus : vs}
                  customStyle={{
                    margin: 0,
                    padding: "1.5rem",
                    borderRadius: "8px",
                    backgroundColor: "transparent",
                  }}
                >
                  {
                    sampleCode[
                      Object.keys(sampleCode)[
                        activeTab
                      ] as keyof typeof sampleCode
                    ]
                  }
                </SyntaxHighlighter>
              </Paper>

              <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
                <Button
                  variant="contained"
                  startIcon={
                    isCreating ? (
                      <CircularProgress size={20} />
                    ) : (
                      <PlayArrowIcon />
                    )
                  }
                  onClick={handleCreateDemoNote}
                  disabled={isCreating}
                  className="elegant-button"
                >
                  {isCreating ? "Creating..." : "Create Demo Note"}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Box sx={{ textAlign: "center", mt: 6 }}>
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              sx={{ fontWeight: 600 }}
            >
              Ready to Get Started?
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Create your first note and experience the elegance of CodeBoard
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/notes/create")}
              className="elegant-button"
              sx={{ px: 4, py: 1.5 }}
            >
              Create Your First Note
            </Button>
          </Box>
        </motion.div>
      </motion.div>
    </Container>
  );
};

export default FeatureDemoPage;
