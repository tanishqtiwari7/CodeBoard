package dev.tanishq.codeboard.service;

import dev.tanishq.codeboard.exception.ResourceNotFoundException;
import dev.tanishq.codeboard.model.CodeNote;
import dev.tanishq.codeboard.model.CodeSnippet;
import dev.tanishq.codeboard.model.NoteTag;
import dev.tanishq.codeboard.repository.CodeNoteRepository;
import dev.tanishq.codeboard.repository.CodeSnippetRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Service class for managing CodeNote business logic.
 * 
 * This service handles:
 * - CRUD operations for notes
 * - Search and filtering functionality
 * - Business rules and validations
 * - Transaction management
 * - Note-related analytics and statistics
 */
@Service
@Transactional
public class CodeNoteService {

    private static final Logger logger = LoggerFactory.getLogger(CodeNoteService.class);
    
    private final CodeNoteRepository codeNoteRepository;
    private final CodeSnippetRepository codeSnippetRepository;

    @Autowired
    public CodeNoteService(CodeNoteRepository codeNoteRepository, 
                          CodeSnippetRepository codeSnippetRepository) {
        this.codeNoteRepository = codeNoteRepository;
        this.codeSnippetRepository = codeSnippetRepository;
    }

    /**
     * Retrieves all notes ordered by creation date (newest first)
     * @return List of all notes sorted by creation date (descending)
     */
    @Transactional(readOnly = true)
    public List<CodeNote> getAllNotes() {
        logger.debug("Fetching all notes ordered by creation date");
        return codeNoteRepository.findAllByOrderByCreatedAtDesc();
    }

    /**
     * Retrieves notes with pagination
     * @param page Page number (0-based)
     * @param size Page size
     * @param sortBy Field to sort by
     * @param sortDirection Sort direction (asc/desc)
     * @return Paginated list of notes
     */
    @Transactional(readOnly = true)
    public Page<CodeNote> getAllNotes(int page, int size, String sortBy, String sortDirection) {
        logger.debug("Fetching paginated notes: page={}, size={}, sortBy={}, sortDirection={}", 
                    page, size, sortBy, sortDirection);
                    
        Sort sort = sortDirection.equalsIgnoreCase("desc") 
            ? Sort.by(sortBy).descending() 
            : Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        return codeNoteRepository.findAll(pageable);
    }

    /**
     * Retrieves a note by ID
     * @param id Note ID
     * @return The note if found
     * @throws ResourceNotFoundException if note doesn't exist
     */
    @Transactional(readOnly = true)
    public CodeNote getNoteById(Long id) {
        logger.debug("Fetching note with ID: {}", id);
        return codeNoteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Note not found with id: " + id));
    }
    
    /**
     * Retrieves a note by ID with its snippets eagerly loaded
     * @param id Note ID
     * @return The note with snippets if found
     * @throws ResourceNotFoundException if note doesn't exist
     */
    @Transactional(readOnly = true)
    public CodeNote getNoteWithSnippets(Long id) {
        logger.debug("Fetching note with snippets for ID: {}", id);
        return codeNoteRepository.findByIdWithSnippets(id)
                .orElseThrow(() -> new ResourceNotFoundException("Note not found with id: " + id));
    }

    /**
     * Creates a new note
     * @param note The note to create
     * @return The created note with generated ID
     */
    public CodeNote createNote(CodeNote note) {
        logger.debug("Creating new note: {}", note.getTitle());
        validateNote(note);
        
        // Set bidirectional relationship for snippets
        if (note.getSnippets() != null) {
            note.getSnippets().forEach(snippet -> snippet.setNote(note));
        }
        
        return codeNoteRepository.save(note);
    }

    /**
     * Updates an existing note
     * @param id Note ID to update
     * @param updatedNote New note data
     * @return The updated note
     * @throws ResourceNotFoundException if note doesn't exist
     */
    public CodeNote updateNote(Long id, CodeNote updatedNote) {
        logger.debug("Updating note with ID: {}", id);
        CodeNote existingNote = getNoteById(id);
        
        validateNote(updatedNote);
        
        // Update basic fields
        existingNote.setTitle(updatedNote.getTitle());
        existingNote.setDescription(updatedNote.getDescription());
        existingNote.setContent(updatedNote.getContent());
        existingNote.setTags(updatedNote.getTags());
        
        // Update snippets if provided
        if (updatedNote.getSnippets() != null) {
            // Track existing snippets to detect which ones should be removed
            Set<Long> existingSnippetIds = existingNote.getSnippets().stream()
                .map(CodeSnippet::getId)
                .filter(sid -> sid != null)
                .collect(Collectors.toSet());
                
            Set<Long> updatedSnippetIds = updatedNote.getSnippets().stream()
                .map(CodeSnippet::getId)
                .filter(sid -> sid != null)
                .collect(Collectors.toSet());
                
            // Clear existing snippets
            existingNote.getSnippets().clear();
            
            // Add new snippets with proper relationships
            updatedNote.getSnippets().forEach(snippet -> {
                snippet.setNote(existingNote);
                existingNote.getSnippets().add(snippet);
            });
            
            // Delete orphaned snippets that were removed from the note
            existingSnippetIds.stream()
                .filter(snippetId -> !updatedSnippetIds.contains(snippetId))
                .forEach(codeSnippetRepository::deleteById);
        }
        
        return codeNoteRepository.save(existingNote);
    }

    /**
     * Deletes a note by ID
     * @param id Note ID to delete
     * @throws ResourceNotFoundException if note doesn't exist
     */
    public void deleteNote(Long id) {
        logger.debug("Deleting note with ID: {}", id);
        if (!codeNoteRepository.existsById(id)) {
            throw new ResourceNotFoundException("Note not found with id: " + id);
        }
        
        // Delete all associated snippets first to avoid orphaned records
        codeSnippetRepository.deleteByNoteId(id);
        
        // Delete the note
        codeNoteRepository.deleteById(id);
    }

    /**
     * Searches notes by text content
     * @param searchTerm Term to search for in title, description, and content
     * @return List of matching notes
     */
    @Transactional(readOnly = true)
    public List<CodeNote> searchNotes(String searchTerm) {
        logger.debug("Searching notes with term: {}", searchTerm);
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return getAllNotes();
        }
        return codeNoteRepository.searchByTitleDescriptionOrContent(searchTerm.trim());
    }

    /**
     * Finds notes by tags (any tag matches)
     * @param tags Set of tags to search for
     * @return List of notes that have any of the specified tags
     */
    @Transactional(readOnly = true)
    public List<CodeNote> getNotesByTags(Set<NoteTag> tags) {
        logger.debug("Finding notes by tags (any match): {}", tags);
        if (tags == null || tags.isEmpty()) {
            return getAllNotes();
        }
        return codeNoteRepository.findByTagsIn(tags);
    }

    /**
     * Finds notes that contain all specified tags
     * @param tags Set of tags that must all be present
     * @return List of notes that have all of the specified tags
     */
    @Transactional(readOnly = true)
    public List<CodeNote> getNotesByAllTags(Set<NoteTag> tags) {
        logger.debug("Finding notes by tags (all must match): {}", tags);
        if (tags == null || tags.isEmpty()) {
            return getAllNotes();
        }
        return codeNoteRepository.findByAllTags(tags, tags.size());
    }

    /**
     * Advanced search with multiple criteria
     * @param searchTerm Optional text search term
     * @param tags Optional set of tags to filter by
     * @param startDate Optional minimum creation date
     * @param endDate Optional maximum creation date
     * @param page Page number (0-based)
     * @param size Page size
     * @param sortBy Field to sort by
     * @param sortDirection Sort direction (asc/desc)
     * @return Paginated search results
     */
    @Transactional(readOnly = true)
    public Page<CodeNote> searchNotesWithCriteria(
            String searchTerm,
            Set<NoteTag> tags,
            LocalDateTime startDate,
            LocalDateTime endDate,
            int page,
            int size,
            String sortBy,
            String sortDirection) {
        
        logger.debug("Advanced search with criteria: term={}, tags={}, startDate={}, endDate={}, page={}, size={}", 
                    searchTerm, tags, startDate, endDate, page, size);
        
        Sort sort = sortDirection.equalsIgnoreCase("desc") 
            ? Sort.by(sortBy).descending() 
            : Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        
        // Prepare sanitized search term
        String sanitizedTerm = searchTerm != null && !searchTerm.trim().isEmpty() ? searchTerm.trim() : null;
        
        Page<CodeNote> results = codeNoteRepository.findWithCriteria(
            sanitizedTerm,
            startDate,
            endDate,
            pageable
        );
        
        // If tags are specified, filter the results further
        // This is needed because SQLite doesn't support complex join conditions well
        if (tags != null && !tags.isEmpty()) {
            // Convert page to list for filtering
            List<CodeNote> filteredNotes = results.getContent().stream()
                .filter(note -> {
                    Set<NoteTag> noteTags = note.getTags();
                    return noteTags.stream().anyMatch(tags::contains);
                })
                .collect(Collectors.toList());
            
            // Return filtered results as a new Page
            return new org.springframework.data.domain.PageImpl<>(
                filteredNotes,
                PageRequest.of(0, Math.max(1, filteredNotes.size())),
                filteredNotes.size()
            );
        }
        
        return results;
    }

    /**
     * Gets recently active notes (created or updated in the last N days)
     * @param days Number of days to look back
     * @return List of recently active notes
     */
    @Transactional(readOnly = true)
    public List<CodeNote> getRecentlyActiveNotes(int days) {
        logger.debug("Finding recently active notes from last {} days", days);
        LocalDateTime sinceDate = LocalDateTime.now().minusDays(days);
        return codeNoteRepository.findRecentlyActive(sinceDate);
    }

    /**
     * Gets statistics about notes by tags
     * @return List of tag and count pairs
     */
    @Transactional(readOnly = true)
    public List<Object[]> getNoteStatsByTag() {
        logger.debug("Retrieving note statistics by tag");
        return codeNoteRepository.countNotesByTag();
    }
    
    /**
     * Find notes that don't have any tags
     * @return List of notes without tags
     */
    @Transactional(readOnly = true)
    public List<CodeNote> getNotesWithoutTags() {
        logger.debug("Finding notes without tags");
        return codeNoteRepository.findNotesWithoutTags();
    }
    
    /**
     * Find notes with snippets in a specific language
     * @param language The programming language
     * @return List of notes with snippets in the specified language
     */
    @Transactional(readOnly = true)
    public List<CodeNote> getNotesBySnippetLanguage(String language) {
        logger.debug("Finding notes with snippets in language: {}", language);
        return codeNoteRepository.findBySnippetLanguage(language);
    }
    
    /**
     * Count notes created per day in the given date range
     * @param startDate Start of date range
     * @param endDate End of date range
     * @return List of date and count pairs
     */
    @Transactional(readOnly = true)
    public List<Object[]> getNotesCreationStats(LocalDateTime startDate, LocalDateTime endDate) {
        logger.debug("Getting note creation stats from {} to {}", startDate, endDate);
        return codeNoteRepository.countNotesByCreationDate(startDate, endDate);
    }

    /**
     * Validates a note before saving
     * @param note The note to validate
     * @throws IllegalArgumentException if validation fails
     */
    private void validateNote(CodeNote note) {
        if (note == null) {
            throw new IllegalArgumentException("Note cannot be null");
        }
        
        if (note.getTitle() == null || note.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Note title is required");
        }
        
        if (note.getTitle().length() > 200) {
            throw new IllegalArgumentException("Note title cannot exceed 200 characters");
        }
        
        if (note.getDescription() != null && note.getDescription().length() > 1000) {
            throw new IllegalArgumentException("Note description cannot exceed 1000 characters");
        }
        
        if (note.getContent() != null && note.getContent().length() > 50000) {
            throw new IllegalArgumentException("Note content cannot exceed 50000 characters");
        }
        
        // Ensure tags collection is not null
        if (note.getTags() == null) {
            note.setTags(new HashSet<>());
        }
        
        // Validate snippets if present
        if (note.getSnippets() != null) {
            for (CodeSnippet snippet : note.getSnippets()) {
                if (snippet.getName() == null || snippet.getName().trim().isEmpty()) {
                    throw new IllegalArgumentException("Snippet name is required");
                }
                if (snippet.getName().length() > 200) {
                    throw new IllegalArgumentException("Snippet name cannot exceed 200 characters");
                }
                if (snippet.getContent() != null && snippet.getContent().length() > 100000) {
                    throw new IllegalArgumentException("Snippet content cannot exceed 100000 characters");
                }
            }
        }
    }
    
    /**
     * Updates the tags for a note
     * @param noteId Note ID
     * @param tags New set of tags
     * @return The updated note
     */
    public CodeNote updateNoteTags(Long noteId, Set<NoteTag> tags) {
        logger.debug("Updating tags for note with ID {}: {}", noteId, tags);
        CodeNote note = getNoteById(noteId);
        
        // Set new tags
        note.setTags(tags != null ? tags : new HashSet<>());
        
        return codeNoteRepository.save(note);
    }
    
    /**
     * Find notes with title containing the search term
     * @param titleSearch Term to search for in titles
     * @return List of matching notes
     */
    @Transactional(readOnly = true)
    public List<CodeNote> findByTitleContaining(String titleSearch) {
        logger.debug("Searching notes by title: {}", titleSearch);
        return codeNoteRepository.findByTitleContainingIgnoreCase(titleSearch);
    }
}

