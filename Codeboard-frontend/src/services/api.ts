/**
 * CodeBoard API Service
 *
 * Legacy API service for backwards compatibility
 * Provides exports from the modular API system
 */

import { api } from "./api/index";

// Export types from notes
export type { CodeNote, CodeSnippet } from "./api/notes";

// Export types from client
export type { ApiResponse, PaginatedResponse } from "./api/client";

// Export types from stats
export type { AppStatistics, UserStatistics } from "./api/stats";

// Notes API legacy exports
export const getNotes = api.notes.getAllNotes;
export const getNote = api.notes.getNoteById;
export const createNote = api.notes.createNote;
export const updateNote = api.notes.updateNote;
export const deleteNote = api.notes.deleteNote;
export const getAvailableTags = api.notes.getNotesByTag;
export const searchNotes = api.notes.searchNotes;

// Snippets API legacy exports
export const getSnippets = api.snippets.getAll;
export const getSnippet = api.snippets.getById;
export const createSnippet = api.snippets.create;
export const updateSnippet = api.snippets.update;
export const deleteSnippet = api.snippets.remove;
export const getSnippetsByLanguage = api.snippets.getByLanguage;
export const getSnippetsByNote = api.snippets.getByNoteId;
export const moveSnippet = (snippetId: number, noteId: number) =>
  api.snippets.update(snippetId, { noteId });

// Stats API legacy exports
export const getAppStats = api.stats.getAppStats;
export const getUserStats = api.stats.getUserStats;

// --- Legacy/Deprecated Functions ---

/** @deprecated Use searchNotes with proper criteria instead */
export async function advancedSearchNotes(criteria: unknown): Promise<unknown> {
  return api.notes.searchNotes(criteria as string);
}

/** @deprecated Use getNotesByTag and aggregate manually if needed */
export async function getTagStatistics(): Promise<Record<string, number>> {
  return api.stats.getTagStats ? api.stats.getTagStats() : {};
}

/** @deprecated Use getSnippets with filters instead */
export async function searchSnippetsByName(_query: string): Promise<unknown> {
  console.warn(
    "searchSnippetsByName is deprecated. Use a more specific search method."
  );
  return api.snippets.getAll();
}

/** @deprecated Use getSnippets with filters instead */
export async function searchSnippetsByContent(
  _query: string
): Promise<unknown> {
  console.warn(
    "searchSnippetsByContent is deprecated. Use a more specific search method."
  );
  return api.snippets.getAll();
}

/** @deprecated Use getAppStats or getUserStats for snippet statistics */
export async function getSnippetStatistics(): Promise<Record<string, number>> {
  return api.stats.getLanguageStats();
}

export async function updateSnippetLanguage(
  snippetId: string | number,
  language: string
): Promise<unknown> {
  return api.snippets.update(Number(snippetId), { language });
}

// Export the full modular API for advanced use cases
export { api };

// Legacy default export for backwards compatibility
export default {
  // Notes API
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
  searchNotes,
  advancedSearchNotes,
  getAvailableTags,
  getTagStatistics,

  // Snippets API
  getSnippets,
  getSnippet,
  getSnippetsByNote,
  getSnippetsByLanguage,
  createSnippet,
  updateSnippet,
  deleteSnippet,
  searchSnippetsByName,
  searchSnippetsByContent,
  moveSnippet,
  getSnippetStatistics,
  updateSnippetLanguage,

  // Stats API
  getAppStats,
  getUserStats,

  // Modular API
  api,
};
