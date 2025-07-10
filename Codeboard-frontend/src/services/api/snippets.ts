/**
 * Code Snippets API Service
 *
 * Provides methods to interact with code snippets
 */

import type { AxiosResponse } from "axios";
import { apiClient } from "./client";
import type { CodeSnippet } from "./notes";

interface ExecuteResponse {
  result: string;
  executionTime: number;
  success: boolean;
  language: string;
}

/**
 * Get all snippets (optionally by note ID)
 */
export async function getAll(noteId?: number): Promise<CodeSnippet[]> {
  const params = noteId ? `?noteId=${noteId}` : "";
  const { data } = await apiClient.get<
    CodeSnippet[],
    AxiosResponse<CodeSnippet[]>
  >(`/snippets${params}`);
  return data;
}

/**
 * Get a specific snippet by ID
 */
export async function getById(id: number): Promise<CodeSnippet> {
  const { data } = await apiClient.get<CodeSnippet, AxiosResponse<CodeSnippet>>(
    `/snippets/${id}`
  );
  return data;
}

/**
 * Create a new snippet
 */
export async function create(
  snippet: Omit<CodeSnippet, "id" | "createdAt" | "updatedAt">
): Promise<CodeSnippet> {
  const { data } = await apiClient.post<
    CodeSnippet,
    AxiosResponse<CodeSnippet>,
    typeof snippet
  >("/snippets", snippet);
  return data;
}

/**
 * Update an existing snippet
 */
export async function update(
  id: number,
  snippet: Partial<Omit<CodeSnippet, "id" | "createdAt" | "updatedAt">>
): Promise<CodeSnippet> {
  const { data } = await apiClient.put<
    CodeSnippet,
    AxiosResponse<CodeSnippet>,
    typeof snippet
  >(`/snippets/${id}`, snippet);
  return data;
}

/**
 * Delete a snippet by ID
 */
export async function remove(id: number): Promise<void> {
  await apiClient.delete(`/snippets/${id}`);
}

/**
 * Get all snippets by language
 */
export async function getByLanguage(language: string): Promise<CodeSnippet[]> {
  const { data } = await apiClient.get<
    CodeSnippet[],
    AxiosResponse<CodeSnippet[]>
  >(`/code-snippets/language/${language}`);
  return data;
}

/**
 * Get snippets for a specific note
 */
export async function getByNoteId(noteId: number): Promise<CodeSnippet[]> {
  const { data } = await apiClient.get<
    CodeSnippet[],
    AxiosResponse<CodeSnippet[]>
  >(`/code-snippets?noteId=${noteId}`);
  return data;
}

/**
 * Execute a code snippet (if execution is enabled)
 */
export async function execute(id: number): Promise<ExecuteResponse> {
  const { data } = await apiClient.post<
    ExecuteResponse,
    AxiosResponse<ExecuteResponse>
  >(`/code-snippets/${id}/execute`);
  return data;
}
