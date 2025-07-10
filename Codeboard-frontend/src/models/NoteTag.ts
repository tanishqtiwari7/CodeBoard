/**
 * Interface representing available tags for code notes.
 * Mirrors the backend NoteTag enum with additional display properties.
 */
export interface NoteTag {
  name: string;
  displayName?: string;
  emoji?: string;
  description?: string;
}
