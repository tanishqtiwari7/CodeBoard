/**
 * Simplified tags for CodeBoard
 * Only 10 basic tags for organizing code notes
 */

export interface TagOption {
  name: string;
  displayName: string;
  emoji: string;
  color: string;
  description: string;
}

export const PREDEFINED_TAGS: TagOption[] = [
  // Code Categories
  {
    name: "algorithm",
    displayName: "Algorithm",
    emoji: "🧮",
    color: "#ff6b6b",
    description: "Algorithms and data structures",
  },
  {
    name: "api",
    displayName: "API",
    emoji: "🔗",
    color: "#4ecdc4",
    description: "API endpoints and integrations",
  },
  {
    name: "frontend",
    displayName: "Frontend",
    emoji: "🖥️",
    color: "#96ceb4",
    description: "Frontend user interface code",
  },
  {
    name: "backend",
    displayName: "Backend",
    emoji: "⚙️",
    color: "#ffeaa7",
    description: "Server-side and backend logic",
  },
  {
    name: "database",
    displayName: "Database",
    emoji: "💾",
    color: "#45b7d1",
    description: "Database schemas and queries",
  },

  // Functionality
  {
    name: "utility",
    displayName: "Utility",
    emoji: "🔧",
    color: "#6c5ce7",
    description: "Utility functions and helpers",
  },
  {
    name: "testing",
    displayName: "Testing",
    emoji: "🧪",
    color: "#a29bfe",
    description: "Unit tests and testing code",
  },
  {
    name: "config",
    displayName: "Config",
    emoji: "⚙️",
    color: "#fdcb6e",
    description: "Configuration files and settings",
  },

  // Special Categories
  {
    name: "example",
    displayName: "Example",
    emoji: "💡",
    color: "#f39c12",
    description: "Example implementations",
  },
  {
    name: "important",
    displayName: "Important",
    emoji: "⭐",
    color: "#f1c40f",
    description: "Important code to remember",
  },
];

export const getTagByName = (name: string): TagOption | undefined => {
  return PREDEFINED_TAGS.find((tag) => tag.name === name);
};

export const getTagColor = (name: string): string => {
  const tag = getTagByName(name);
  return tag ? tag.color : "#6c757d";
};

export const getTagEmoji = (name: string): string => {
  const tag = getTagByName(name);
  return tag ? tag.emoji : "🏷️";
};

export const getTagDisplayName = (name: string): string => {
  const tag = getTagByName(name);
  return tag ? tag.displayName : name;
};
