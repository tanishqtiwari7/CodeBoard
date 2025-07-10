/**
 * Statistics API service
 *
 * Provides methods to fetch application statistics and metrics
 */

import { apiClient } from "./client";

export interface AppStatistics {
  totalNotes: number;
  totalSnippets: number;
  recentlyActive?: number;
  lastUpdated?: string;
  languageBreakdown?: Record<string, number>;
  tagsUsage?: Record<string, number>;
}

export interface UserStatistics {
  notesCreated: number;
  snippetsCreated: number;
  avgNotesPerDay: number;
  mostUsedLanguage?: string;
  mostUsedTag?: string;
}

/**
 * Get application-wide statistics
 */
export async function getAppStats(): Promise<AppStatistics> {
  const response = await apiClient.get<AppStatistics>("/stats");
  return response.data;
}

/**
 * Get user-specific statistics
 */
export async function getUserStats(): Promise<UserStatistics> {
  const response = await apiClient.get<UserStatistics>("/stats/user");
  return response.data;
}

/**
 * Get language usage statistics
 */
export async function getLanguageStats(): Promise<Record<string, number>> {
  const response = await apiClient.get<Record<string, number>>("/stats/languages");
  return response.data;
}

/**
 * Get tag usage statistics
 */
export async function getTagStats(): Promise<Record<string, number>> {
  const response = await apiClient.get<Record<string, number>>("/stats/tags");
  return response.data;
}

/**
 * Get time-based activity metrics
 * @param period - time period (day, week, month, year)
 */
export async function getActivityMetrics(
  period: "day" | "week" | "month" | "year" = "month"
): Promise<any> {
  return await apiClient.get<any>(`/stats/activity?period=${period}`);
}
