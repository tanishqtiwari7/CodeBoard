/**
 * AboutPage.tsx - Information about CodeBoard and its features
 *
 * This page provides an overview of CodeBoard, its purpose, features,
 * and links to demonstrations of its components and capabilities.
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../theme/ThemeContext";

// Material UI Components
import {
  Box,
  Typography,
  Paper,
  Container,
  Divider,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

// Material UI Icons
import CodeIcon from "@mui/icons-material/Code";
import StorageIcon from "@mui/icons-material/Storage";
import PaletteIcon from "@mui/icons-material/Palette";
import DeveloperModeIcon from "@mui/icons-material/DeveloperMode";
import SpeedIcon from "@mui/icons-material/Speed";
import SecurityIcon from "@mui/icons-material/Security";
import BuildIcon from "@mui/icons-material/Build";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const AboutPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

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
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          color="primary"
          fontWeight="bold"
          textAlign="center"
        >
          About CodeBoard
        </Typography>

        <Typography variant="h6" sx={{ mb: 4 }} textAlign="center">
          A modern, feature-rich platform for storing and managing your code
          snippets, notes, and programming references.
        </Typography>

        <Divider sx={{ mb: 4 }} />

        {/* Main Description */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="body1" paragraph>
            CodeBoard is designed to be the central hub for all your programming
            knowledge. Whether you're saving snippets for future reference,
            documenting complex algorithms, or organizing your learning journey,
            CodeBoard provides the tools you need with a clean, intuitive
            interface.
          </Typography>

          <Typography variant="body1" paragraph>
            Built with modern technologies like React, TypeScript, Spring Boot
            and Material UI, CodeBoard delivers a seamless experience across
            devices with thoughtful features like syntax highlighting, tags,
            search, and dark mode.
          </Typography>
        </Box>

        {/* Key Features Section */}
        <Typography variant="h4" component="h2" sx={{ mb: 3 }} color="primary">
          Key Features
        </Typography>

        <Grid container spacing={3} sx={{ mb: 5 }}>
          <Grid item xs={12} md={6}>
            <Card
              variant="outlined"
              sx={{
                height: "100%",
                border: `1px solid ${theme.palette.divider}`,
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 3,
                },
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <CodeIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" component="h3">
                    Code Management
                  </Typography>
                </Box>
                <List dense>
                  <ListItem>
                    <ListItemText primary="Syntax highlighting for multiple languages" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Tags and categorization" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Markdown support for documentation" />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card
              variant="outlined"
              sx={{
                height: "100%",
                border: `1px solid ${theme.palette.divider}`,
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 3,
                },
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <PaletteIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" component="h3">
                    User Experience
                  </Typography>
                </Box>
                <List dense>
                  <ListItem>
                    <ListItemText primary="Dark and light themes" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Responsive design for all devices" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Customizable interface" />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card
              variant="outlined"
              sx={{
                height: "100%",
                border: `1px solid ${theme.palette.divider}`,
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 3,
                },
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <StorageIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" component="h3">
                    Data Management
                  </Typography>
                </Box>
                <List dense>
                  <ListItem>
                    <ListItemText primary="Robust database storage" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Import and export functionality" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Data backup options" />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card
              variant="outlined"
              sx={{
                height: "100%",
                border: `1px solid ${theme.palette.divider}`,
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 3,
                },
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <SpeedIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" component="h3">
                    Performance
                  </Typography>
                </Box>
                <List dense>
                  <ListItem>
                    <ListItemText primary="Fast search and filtering" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Optimized for large code collections" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Efficient state management" />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Feature Demo Section */}
        <Card
          sx={{
            mb: 4,
            background:
              theme.palette.mode === "dark"
                ? "linear-gradient(45deg, #2d2519 30%, #362a22 90%)"
                : "linear-gradient(45deg, #f9f2e7 30%, #f2e8d6 90%)",
            boxShadow: 3,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography
              variant="h5"
              component="h3"
              gutterBottom
              color="primary"
            >
              Feature Demonstration
            </Typography>
            <Typography variant="body1" paragraph>
              Explore our interactive feature demo to see CodeBoard's components
              in action, including toast notifications, code highlighting,
              loading states, and more.
            </Typography>
          </CardContent>
          <CardActions sx={{ px: 3, pb: 3 }}>
            <Button
              variant="contained"
              color="primary"
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate("/demo")}
            >
              View Feature Demo
            </Button>
          </CardActions>
        </Card>

        {/* Tech Stack */}
        <Typography variant="h4" component="h2" sx={{ mb: 3 }} color="primary">
          Tech Stack
        </Typography>

        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Frontend
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <DeveloperModeIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="React with TypeScript" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <PaletteIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Material UI for component library" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <BuildIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Vite for fast development and builds" />
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Backend
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <SecurityIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Spring Boot Java framework" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <StorageIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="H2/PostgreSQL database" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <SportsEsportsIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="RESTful API architecture" />
              </ListItem>
            </List>
          </Grid>
        </Grid>

        {/* Call to action */}
        <Box textAlign="center" mt={5}>
          <Typography variant="h5" component="h2" gutterBottom>
            Ready to organize your code?
          </Typography>
          <Box mt={2}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate("/notes/create")}
              sx={{
                mr: 2,
                px: 4,
                py: 1,
                borderRadius: 2,
              }}
            >
              Create Your First Note
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate("/")}
              sx={{
                px: 4,
                py: 1,
                borderRadius: 2,
              }}
            >
              Browse Examples
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default AboutPage;
