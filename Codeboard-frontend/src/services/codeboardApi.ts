/**
 * Simplified CodeBoard API
 * Provides all the functionality of the original API but simplified
 * Can work with either localStorage or a simple backend
 */

import { USE_LOCAL_STORAGE, API_BASE_URL } from './apiConfig';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export interface CodeNote {
  id: number;
  title: string;
  description?: string;
  content?: string;
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
  viewCount?: number;
}

export interface NoteTag {
  name: string;
  displayName?: string;
  emoji?: string;
  description?: string;
  color?: string;
  displayWithEmoji?: string;
}

// =============================================================================
// BACKEND API FUNCTIONS
// =============================================================================

const backendApi = {
  async getAllNotes(): Promise<CodeNote[]> {
    const response = await fetch(`${API_BASE_URL}/api/codenotes`);
    if (!response.ok) throw new Error('Failed to fetch notes');
    return response.json();
  },

  async getNoteById(id: number): Promise<CodeNote> {
    const response = await fetch(`${API_BASE_URL}/api/codenotes/${id}`);
    if (!response.ok) throw new Error('Note not found');
    return response.json();
  },

  async createNote(noteData: Omit<CodeNote, 'id' | 'createdAt' | 'updatedAt' | 'viewCount'>): Promise<CodeNote> {
    const response = await fetch(`${API_BASE_URL}/api/codenotes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(noteData),
    });
    if (!response.ok) throw new Error('Failed to create note');
    return response.json();
  },

  async updateNote(id: number, noteData: Partial<CodeNote>): Promise<CodeNote> {
    const response = await fetch(`${API_BASE_URL}/api/codenotes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(noteData),
    });
    if (!response.ok) throw new Error('Failed to update note');
    return response.json();
  },

  async deleteNote(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/codenotes/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete note');
  },

  async searchNotes(query: string): Promise<CodeNote[]> {
    const response = await fetch(`${API_BASE_URL}/api/codenotes/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Failed to search notes');
    return response.json();
  },

  async getTags(): Promise<NoteTag[]> {
    const response = await fetch(`${API_BASE_URL}/api/codenotes/tags`);
    if (!response.ok) throw new Error('Failed to fetch tags');
    return response.json();
  },

  async incrementNoteViewCount(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/codenotes/${id}/increment-view`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to increment view count');
  },

  async getStats(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/codenotes/stats`);
    if (!response.ok) throw new Error('Failed to fetch stats');
    return response.json();
  },
};

// =============================================================================
// LOCALSTORAGE API FUNCTIONS
// =============================================================================

const localStorageApi = {
  STORAGE_KEY: 'codeboard_notes',
  COUNTER_KEY: 'codeboard_counter',

  getNotes(): CodeNote[] {
    const notesJson = localStorage.getItem(this.STORAGE_KEY);
    return notesJson ? JSON.parse(notesJson) : [];
  },

  saveNotes(notes: CodeNote[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(notes));
  },

  getNextId(): number {
    const counter = localStorage.getItem(this.COUNTER_KEY);
    const nextId = counter ? parseInt(counter) + 1 : 1;
    localStorage.setItem(this.COUNTER_KEY, nextId.toString());
    return nextId;
  },

  async getAllNotes(): Promise<CodeNote[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(this.getNotes()), 50);
    });
  },

  async getNoteById(id: number): Promise<CodeNote> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const notes = this.getNotes();
        const note = notes.find(n => n.id === id);
        if (note) resolve(note);
        else reject(new Error('Note not found'));
      }, 50);
    });
  },

  async createNote(noteData: Omit<CodeNote, 'id' | 'createdAt' | 'updatedAt' | 'viewCount'>): Promise<CodeNote> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const notes = this.getNotes();
        const newNote: CodeNote = {
          ...noteData,
          id: this.getNextId(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          viewCount: 0,
        };
        notes.push(newNote);
        this.saveNotes(notes);
        resolve(newNote);
      }, 50);
    });
  },

  async updateNote(id: number, noteData: Partial<CodeNote>): Promise<CodeNote> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const notes = this.getNotes();
        const noteIndex = notes.findIndex(n => n.id === id);
        if (noteIndex !== -1) {
          notes[noteIndex] = {
            ...notes[noteIndex],
            ...noteData,
            updatedAt: new Date().toISOString(),
          };
          this.saveNotes(notes);
          resolve(notes[noteIndex]);
        } else {
          reject(new Error('Note not found'));
        }
      }, 50);
    });
  },

  async deleteNote(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const notes = this.getNotes();
        const noteIndex = notes.findIndex(n => n.id === id);
        if (noteIndex !== -1) {
          notes.splice(noteIndex, 1);
          this.saveNotes(notes);
          resolve();
        } else {
          reject(new Error('Note not found'));
        }
      }, 50);
    });
  },

  async searchNotes(query: string): Promise<CodeNote[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const notes = this.getNotes();
        const searchQuery = query.toLowerCase();
        const filteredNotes = notes.filter(note => 
          note.title.toLowerCase().includes(searchQuery) ||
          (note.description?.toLowerCase().includes(searchQuery)) ||
          (note.content?.toLowerCase().includes(searchQuery)) ||
          note.tags.some(tag => tag.toLowerCase().includes(searchQuery))
        );
        resolve(filteredNotes);
      }, 50);
    });
  },

  async getTags(): Promise<NoteTag[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const notes = this.getNotes();
        const allTags = notes.flatMap(note => note.tags);
        const uniqueTags = [...new Set(allTags)];
        const tagObjects = uniqueTags.map(tag => ({ name: tag, displayName: tag }));
        resolve(tagObjects);
      }, 50);
    });
  },

  async incrementNoteViewCount(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const notes = this.getNotes();
        const noteIndex = notes.findIndex(n => n.id === id);
        if (noteIndex !== -1) {
          notes[noteIndex].viewCount = (notes[noteIndex].viewCount || 0) + 1;
          this.saveNotes(notes);
          resolve();
        } else {
          reject(new Error('Note not found'));
        }
      }, 25);
    });
  },

  async getStats(): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const notes = this.getNotes();
        const stats = {
          totalNotes: notes.length,
          totalTags: new Set(notes.flatMap(n => n.tags)).size,
          totalViews: notes.reduce((sum, note) => sum + (note.viewCount || 0), 0),
          recentNotes: notes.slice(-5).reverse(),
        };
        resolve(stats);
      }, 50);
    });
  },
};

// =============================================================================
// UNIFIED API EXPORTS
// =============================================================================

const api = USE_LOCAL_STORAGE ? localStorageApi : backendApi;

export const getAllNotes = api.getAllNotes.bind(api);
export const getNoteById = api.getNoteById.bind(api);
export const createNote = api.createNote.bind(api);
export const updateNote = api.updateNote.bind(api);
export const deleteNote = api.deleteNote.bind(api);
export const searchNotes = api.searchNotes.bind(api);
export const getTags = api.getTags.bind(api);
export const incrementNoteViewCount = api.incrementNoteViewCount.bind(api);
export const getStats = api.getStats.bind(api);

// Legacy exports for backward compatibility
export const getNotes = getAllNotes;
export const getNote = getNoteById;
export const getAppStats = getStats;
export const getUserStats = getStats;

// Export/Import functionality
export async function exportData(): Promise<any> {
  const [notes, tags, stats] = await Promise.all([
    getAllNotes(),
    getTags(),
    getStats().catch(() => null),
  ]);

  return {
    version: '1.0.0',
    exportDate: new Date().toISOString(),
    data: { notes, tags, statistics: stats },
  };
}

export async function importData(data: any): Promise<void> {
  if (!data.data || !data.data.notes) {
    throw new Error('Invalid import data format');
  }

  for (const note of data.data.notes) {
    try {
      const { id, createdAt, updatedAt, ...noteData } = note;
      await createNote(noteData);
    } catch (error) {
      console.warn('Failed to import note:', note.title, error);
    }
  }
}

export async function clearAllData(): Promise<void> {
  const notes = await getAllNotes();
  for (const note of notes) {
    if (note.id) {
      await deleteNote(note.id);
    }
  }
}

// Configuration info
export const API_MODE = USE_LOCAL_STORAGE ? 'localStorage' : 'backend';
console.log(`📱 CodeBoard API Mode: ${API_MODE}`);
