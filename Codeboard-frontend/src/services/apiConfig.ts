/**
 * Configuration for CodeBoard API
 * Set USE_LOCAL_STORAGE to true to use localStorage instead of backend
 */

// Change this to true to use localStorage instead of backend
export const USE_LOCAL_STORAGE = true;

// Backend API URL (when USE_LOCAL_STORAGE is false)
export const API_BASE_URL = "http://localhost:8080";

// Configuration for localStorage mode
export const LOCAL_STORAGE_CONFIG = {
  STORAGE_KEY: "codeboard_notes",
  COUNTER_KEY: "codeboard_counter",
  SIMULATE_DELAY: 100, // ms delay to simulate API calls
};
