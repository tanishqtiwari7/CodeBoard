/**
 * API Service index
 *
 * Exports all API services for consumption throughout the application
 */

import { apiClient } from "./client";
import * as notes from "./notes";
import * as snippets from "./snippets";
import * as stats from "./stats";

/**
 * Main API service object with all endpoints organized by domain
 */
export const api = {
  /**
   * Note operations - create, read, update, delete, search
   */
  notes,

  /**
   * Code snippet operations - create, read, update, delete
   */
  snippets,

  /**
   * Statistics and metrics
   */
  stats,

  /**
   * Direct access to the API client for advanced usage
   */
  client: apiClient,
};

export type { AppStatistics, UserStatistics } from "./stats";
export type { CodeNote, CodeSnippet } from "./notes";
export type { ApiResponse, PaginatedResponse } from "./client";
