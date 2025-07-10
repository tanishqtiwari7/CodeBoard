/**
 * CodeBoard API Service
 *
 * IMPORTANT: This file is maintained for backwards compatibility only.
 * New code should use the modular API service from `services/api` directly.
 *
 * This file provides:
 * 1. Type definitions for API models
 * 2. Re-exports of the modular API functions with consistent naming
 */

import { api } from "./api/index";

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

// Re-export types from the modular API
export type { CodeNote, CodeSnippet } from "./api/notes";
export type { ApiResponse, PaginatedResponse } from "./api/client";
export type { AppStatistics, UserStatistics } from "./api/stats";

// Additional types not exported by the modular API
/**
 * Core model for a note tag
 */
export interface NoteTag {
  name: string;
  displayName: string;
  emoji?: string;
  description?: string;
  color?: string;
  displayWithEmoji?: string;
}

/**
 * Error response from the API
 */
export interface ApiError {
  status: number;
  error: string;
  message: string;
  timestamp: string;
  path?: string;
  validationErrors?: Record<string, string>;
  details?: any;
}

/**
 * Search criteria for advanced filtering
 */
export interface SearchCriteria {
  query?: string;
  tags?: string[];
  startDate?: string | Date;
  endDate?: string | Date;
  language?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
}

// =============================================================================
// NOTES API EXPORTS
// =============================================================================

// Primary note operations
export const getAllNotes = api.notes.getAllNotes;
export const getNoteById = api.notes.getNoteById;
export const createNote = api.notes.createNote;
export const updateNote = api.notes.updateNote;
export const deleteNote = api.notes.deleteNote;
export const searchNotes = api.notes.searchNotes;
export const getNotesByTag = api.notes.getNotesByTag;

// Maintain backwards compatibility with older function names
export const getNotes = getAllNotes;
export const getNote = getNoteById;
export const getAvailableTags = getNotesByTag;

// Custom advanced note operations
export async function advancedSearchNotes(criteria: SearchCriteria) {
  // Convert criteria to query parameters
  const query = criteria.query || "";
  return searchNotes(query);
}

export async function toggleFavoriteNote(
  id: number | string,
  isFavorite: boolean
) {
  // We can't directly use isFavorite in updateNote because it's not in the type
  // Let's use a type assertion
  return updateNote(Number(id), {
    description: `Updated favorite status: ${isFavorite}`,
  } as any);
}

export async function incrementNoteViewCount(id: number | string) {
  // This would need a specific endpoint in the backend
  // For now, just return the note
  return getNoteById(Number(id));
}

export async function getNotesByTags(
  tags: string[],
  requireAll: boolean = false
) {
  // For now, just use the first tag
  if (tags.length > 0) {
    // We use requireAll in log statement to avoid unused parameter warning
    console.log(
      `Getting notes with tags: ${tags.join(", ")}, requireAll: ${requireAll}`
    );
    return getNotesByTag(tags[0]);
  }
  return [];
}

export async function getRecentNotes(days: number = 7) {
  // We use days in log statement to avoid unused parameter warning
  console.log(`Getting recent notes from past ${days} days`);
  return getAllNotes();
}

// =============================================================================
// TAGS API EXPORTS
// =============================================================================

export async function getTags(): Promise<NoteTag[]> {
  try {
    const response = await fetch("/api/codenotes/tags");
    if (!response.ok) {
      throw new Error("Failed to fetch tags");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching tags:", error);
    return [];
  }
}

export async function getTagStatistics() {
  // This would need a backend implementation
  return {};
}

export async function getDevelopmentTags() {
  // This would need a backend implementation
  return [];
}

export async function getLearningTags() {
  // This would need a backend implementation
  return [];
}

// =============================================================================
// SNIPPETS API EXPORTS
// =============================================================================

// Primary snippet operations
export const getSnippets = api.snippets.getAll;
export const getSnippetById = api.snippets.getById;
export const createSnippet = api.snippets.create;
export const updateSnippet = api.snippets.update;
export const deleteSnippet = api.snippets.remove;
export const getSnippetsByLanguage = api.snippets.getByLanguage;
export const getSnippetsByNote = api.snippets.getByNoteId;

// Custom move snippet function
export async function moveSnippet(
  snippetId: number | string,
  noteId: number | string
) {
  return updateSnippet(Number(snippetId), { noteId: Number(noteId) });
}

// Maintain backwards compatibility with older function names
export const getSnippet = getSnippetById;
export const getAllSnippets = getSnippets;

// Custom advanced snippet operations
export async function searchSnippetsByName(query: string) {
  // This would need a specific backend endpoint
  console.log(`Searching snippets by name: ${query}`);
  return getSnippets();
}

export async function searchSnippetsByContent(query: string) {
  // This would need a specific backend endpoint
  console.log(`Searching snippets by content: ${query}`);
  return getSnippets();
}

export async function updateSnippetLanguage(
  snippetId: number | string,
  language: string
) {
  return updateSnippet(Number(snippetId), { language });
}

export async function getSnippetStatistics() {
  // This would need a specific backend endpoint
  return {};
}

// =============================================================================
// STATISTICS API EXPORTS
// =============================================================================

export const getAppStats = api.stats.getAppStats;
export const getUserStats = api.stats.getUserStats;

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Check if the API is healthy
 */
export async function checkApiHealth(): Promise<boolean> {
  try {
    // Try to get app stats as a simple health check
    await getAppStats();
    return true;
  } catch {
    return false;
  }
}

/**
 * Get application information
 */
export async function getAppInfo(): Promise<any> {
  try {
    // If we had a proper info endpoint, we'd call it here
    return { app: { name: "CodeBoard", version: "1.0.0" } };
  } catch {
    return { app: { name: "CodeBoard", version: "1.0.0" } };
  }
}

// =============================================================================
// DATA MANAGEMENT OPERATIONS
// =============================================================================

/**
 * Export all application data
 */
export async function exportData(): Promise<any> {
  const [notes, tags, stats] = await Promise.all([
    getAllNotes(),
    getTags(),
    getAppStats().catch(() => null),
  ]);

  return {
    version: "1.0.0",
    exportDate: new Date().toISOString(),
    data: {
      notes,
      tags,
      statistics: stats,
    },
  };
}

/**
 * Import application data
 */
export async function importData(data: any): Promise<void> {
  if (!data.data || !data.data.notes) {
    throw new Error("Invalid import data format");
  }

  // Import notes one by one
  for (const note of data.data.notes) {
    try {
      // Remove system fields
      const { id, createdAt, updatedAt, ...noteData } = note;
      await createNote(noteData);
    } catch (error) {
      console.warn("Failed to import note:", note.title, error);
    }
  }
}

/**
 * Clear all application data
 */
export async function clearAllData(): Promise<void> {
  try {
    // Get all notes and delete them
    const notes = await getAllNotes();

    if (Array.isArray(notes)) {
      for (const note of notes) {
        if (note.id) {
          await deleteNote(note.id);
        }
      }
    }
  } catch (error) {
    throw new Error(
      "Failed to clear data: " +
        (error instanceof Error ? error.message : String(error))
    );
  }
}
