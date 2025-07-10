/**
 * Notes API Service
 *
 * Provides methods to interact with code notes
 */

import type { AxiosResponse } from "axios";
import { apiClient } from "./client";

/**
 * Core model for a code snippet
 */
export interface CodeSnippet {
  id: number;
  title: string;
  content: string;
  language: string;
  noteId?: number;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Core model for a code note
 */
export interface CodeNote {
  id: number;
  title: string;
  description?: string;
  content?: string;
  tags: string[];
  snippets?: CodeSnippet[];
  createdAt?: string;
  updatedAt?: string;
  viewCount?: number;
}

/**
 * Get all notes
 */
export async function getAllNotes(): Promise<CodeNote[]> {
  try {
    console.log("Fetching notes from /codenotes endpoint");
    const { data } = await apiClient.get<CodeNote[], AxiosResponse<CodeNote[]>>(
      "/codenotes"
    );
    console.log("Notes fetched successfully:", data);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Failed to fetch notes:", error);
    // Check if we need to retry with a different endpoint
    try {
      console.log("Retrying with /notes endpoint");
      const { data } = await apiClient.get<
        CodeNote[],
        AxiosResponse<CodeNote[]>
      >("/notes");
      console.log("Notes fetched successfully from /notes:", data);
      return Array.isArray(data) ? data : [];
    } catch (retryError) {
      console.error("Failed to fetch notes from /notes endpoint:", retryError);
      // Return empty array instead of throwing to prevent UI errors
      return [];
    }
  }
}

/**
 * Get a specific note by ID
 */
export async function getNoteById(id: number): Promise<CodeNote> {
  const { data } = await apiClient.get<CodeNote, AxiosResponse<CodeNote>>(
    `/codenotes/${id}`
  );
  return data;
}

/**
 * Create a new note
 */
export async function createNote(
  note: Omit<CodeNote, "id" | "createdAt" | "updatedAt" | "snippets">
): Promise<CodeNote> {
  try {
    console.log("Creating note with data:", note);
    const { data } = await apiClient.post<
      CodeNote,
      AxiosResponse<CodeNote>,
      typeof note
    >("/codenotes", note);
    console.log("Note created successfully:", data);
    return data;
  } catch (error) {
    console.error("Error creating note:", error);
    throw error;
  }
}

/**
 * Update an existing note
 */
export async function updateNote(
  id: number,
  note: Partial<Omit<CodeNote, "id" | "createdAt" | "updatedAt" | "snippets">>
): Promise<CodeNote> {
  const { data } = await apiClient.put<
    CodeNote,
    AxiosResponse<CodeNote>,
    typeof note
  >(`/codenotes/${id}`, note);
  return data;
}

/**
 * Delete a note by ID
 */
export async function deleteNote(id: number): Promise<void> {
  await apiClient.delete(`/codenotes/${id}`);
}

/**
 * Get notes by tag
 */
export async function getNotesByTag(tag: string): Promise<CodeNote[]> {
  const { data } = await apiClient.get<CodeNote[], AxiosResponse<CodeNote[]>>(
    `/codenotes/tag/${tag}`
  );
  return data;
}

/**
 * Search notes by query
 */
export async function searchNotes(query: string): Promise<CodeNote[]> {
  const { data } = await apiClient.get<CodeNote[], AxiosResponse<CodeNote[]>>(
    `/codenotes/search?q=${encodeURIComponent(query)}`
  );
  return data;
}
