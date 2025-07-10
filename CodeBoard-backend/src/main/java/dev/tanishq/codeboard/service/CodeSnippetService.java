package dev.tanishq.codeboard.service;

import dev.tanishq.codeboard.exception.ResourceNotFoundException;
import dev.tanishq.codeboard.model.CodeNote;
import dev.tanishq.codeboard.model.CodeSnippet;
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
import java.util.List;

/**
 * Service class for managing CodeSnippet business logic.
 * 
 * This service handles:
 * - CRUD operations for snippets
 * - Search and filtering functionality
 * - Business rules and validations
 * - Transaction management
 * - Snippet-related analytics
 */
@Service
@Transactional
public class CodeSnippetService {

    private static final Logger logger = LoggerFactory.getLogger(CodeSnippetService.class);
    
    private final CodeSnippetRepository snippetRepository;
    private final CodeNoteRepository noteRepository;
    
    @Autowired
    public CodeSnippetService(CodeSnippetRepository snippetRepository, CodeNoteRepository noteRepository) {
        this.snippetRepository = snippetRepository;
        this.noteRepository = noteRepository;
    }
    
    /**
     * Retrieves all snippets ordered by creation date (newest first)
     * @return List of all snippets sorted by creation date
     */
    @Transactional(readOnly = true)
    public List<CodeSnippet> getAllSnippets() {
        logger.debug("Fetching all snippets ordered by creation date");
        return snippetRepository.findAllByOrderByCreatedAtDesc();
    }
    
    /**
     * Retrieves snippets with pagination
     * @param page Page number (0-based)
     * @param size Page size
     * @param sortBy Field to sort by
     * @param sortDirection Sort direction (asc/desc)
     * @return Paginated list of snippets
     */
    @Transactional(readOnly = true)
    public Page<CodeSnippet> getAllSnippets(int page, int size, String sortBy, String sortDirection) {
        logger.debug("Fetching paginated snippets: page={}, size={}, sortBy={}, sortDirection={}", 
                    page, size, sortBy, sortDirection);
                    
        Sort sort = sortDirection.equalsIgnoreCase("desc") 
            ? Sort.by(sortBy).descending() 
            : Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        return snippetRepository.findAll(pageable);
    }
    
    /**
     * Retrieves a snippet by ID
     * @param id Snippet ID
     * @return The snippet if found
     * @throws ResourceNotFoundException if snippet doesn't exist
     */
    @Transactional(readOnly = true)
    public CodeSnippet getSnippetById(Long id) {
        logger.debug("Fetching snippet with ID: {}", id);
        return snippetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Snippet not found with id: " + id));
    }
    
    /**
     * Retrieves a snippet with its parent note
     * @param id Snippet ID
     * @return The snippet with note if found
     * @throws ResourceNotFoundException if snippet doesn't exist
     */
    @Transactional(readOnly = true)
    public CodeSnippet getSnippetWithNote(Long id) {
        logger.debug("Fetching snippet with note for ID: {}", id);
        return snippetRepository.findByIdWithNote(id)
                .orElseThrow(() -> new ResourceNotFoundException("Snippet not found with id: " + id));
    }
    
    /**
     * Creates a new snippet
     * @param snippet The snippet to create
     * @return The created snippet with generated ID
     * @throws ResourceNotFoundException if parent note doesn't exist
     */
    public CodeSnippet createSnippet(CodeSnippet snippet) {
        logger.debug("Creating new snippet: {}", snippet.getName());
        validateSnippet(snippet);
        
        // Ensure parent note exists and set the relationship
        if (snippet.getNote() != null && snippet.getNote().getId() != null) {
            CodeNote note = noteRepository.findById(snippet.getNote().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Note not found with id: " + snippet.getNote().getId()));
            snippet.setNote(note);
        } else {
            throw new IllegalArgumentException("Snippet must be associated with a valid note");
        }
        
        return snippetRepository.save(snippet);
    }
    
    /**
     * Updates an existing snippet
     * @param id Snippet ID to update
     * @param updatedSnippet New snippet data
     * @return The updated snippet
     * @throws ResourceNotFoundException if snippet doesn't exist
     */
    public CodeSnippet updateSnippet(Long id, CodeSnippet updatedSnippet) {
        logger.debug("Updating snippet with ID: {}", id);
        CodeSnippet existingSnippet = getSnippetById(id);
        
        validateSnippet(updatedSnippet);
        
        // Update fields
        existingSnippet.setName(updatedSnippet.getName());
        existingSnippet.setLanguage(updatedSnippet.getLanguage());
        existingSnippet.setContent(updatedSnippet.getContent());
        existingSnippet.setImageUrl(updatedSnippet.getImageUrl());
        
        // Note relationship should not be changed through this method
        
        return snippetRepository.save(existingSnippet);
    }
    
    /**
     * Moves a snippet to a different note
     * @param snippetId Snippet ID to move
     * @param noteId Destination note ID
     * @return Updated snippet with new parent note
     * @throws ResourceNotFoundException if snippet or note doesn't exist
     */
    public CodeSnippet moveSnippetToNote(Long snippetId, Long noteId) {
        logger.debug("Moving snippet {} to note {}", snippetId, noteId);
        
        CodeSnippet snippet = getSnippetById(snippetId);
        CodeNote newNote = noteRepository.findById(noteId)
                .orElseThrow(() -> new ResourceNotFoundException("Note not found with id: " + noteId));
        
        snippet.setNote(newNote);
        return snippetRepository.save(snippet);
    }
    
    /**
     * Deletes a snippet by ID
     * @param id Snippet ID to delete
     * @throws ResourceNotFoundException if snippet doesn't exist
     */
    public void deleteSnippet(Long id) {
        logger.debug("Deleting snippet with ID: {}", id);
        if (!snippetRepository.existsById(id)) {
            throw new ResourceNotFoundException("Snippet not found with id: " + id);
        }
        snippetRepository.deleteById(id);
    }
    
    /**
     * Finds all snippets for a specific note
     * @param noteId Note ID
     * @return List of snippets belonging to the note
     * @throws ResourceNotFoundException if note doesn't exist
     */
    @Transactional(readOnly = true)
    public List<CodeSnippet> getSnippetsByNote(Long noteId) {
        logger.debug("Fetching snippets for note: {}", noteId);
        
        // Verify note exists
        if (!noteRepository.existsById(noteId)) {
            throw new ResourceNotFoundException("Note not found with id: " + noteId);
        }
        
        return snippetRepository.findByNoteIdOrderByCreatedAtAsc(noteId);
    }
    
    /**
     * Finds snippets by programming language
     * @param language Programming language
     * @return List of snippets in the specified language
     */
    @Transactional(readOnly = true)
    public List<CodeSnippet> getSnippetsByLanguage(String language) {
        logger.debug("Fetching snippets by language: {}", language);
        return snippetRepository.findByLanguageIgnoreCase(language);
    }
    
    /**
     * Finds snippets by name
     * @param name Name to search for
     * @return List of snippets with matching names
     */
    @Transactional(readOnly = true)
    public List<CodeSnippet> searchSnippetsByName(String name) {
        logger.debug("Searching snippets by name: {}", name);
        return snippetRepository.findByNameContainingIgnoreCase(name);
    }
    
    /**
     * Searches snippets by content
     * @param searchTerm Term to search for in content
     * @return List of snippets with matching content
     */
    @Transactional(readOnly = true)
    public List<CodeSnippet> searchSnippetsByContent(String searchTerm) {
        logger.debug("Searching snippets by content: {}", searchTerm);
        return snippetRepository.searchByContent(searchTerm);
    }
    
    /**
     * Searches snippets by content with pagination
     * @param searchTerm Term to search for in content
     * @param page Page number
     * @param size Page size
     * @return Paginated list of snippets with matching content
     */
    @Transactional(readOnly = true)
    public Page<CodeSnippet> searchSnippetsByContent(String searchTerm, int page, int size) {
        logger.debug("Searching snippets by content with pagination: {}", searchTerm);
        Pageable pageable = PageRequest.of(page, size);
        return snippetRepository.searchByContent(searchTerm, pageable);
    }
    
    /**
     * Gets count of snippets by language
     * @return List of language and count pairs
     */
    @Transactional(readOnly = true)
    public List<Object[]> getSnippetCountByLanguage() {
        logger.debug("Getting snippet count by language");
        return snippetRepository.countSnippetsByLanguage();
    }
    
    /**
     * Gets recently created snippets
     * @param days Number of days to look back
     * @return List of recently created snippets
     */
    @Transactional(readOnly = true)
    public List<CodeSnippet> getRecentlyCreatedSnippets(int days) {
        logger.debug("Getting snippets created in the last {} days", days);
        LocalDateTime sinceDate = LocalDateTime.now().minusDays(days);
        return snippetRepository.findRecentlyCreated(sinceDate);
    }
    
    /**
     * Gets large snippets (exceeding specified size)
     * @param minSize Minimum content length
     * @return List of large snippets
     */
    @Transactional(readOnly = true)
    public List<CodeSnippet> getLargeSnippets(int minSize) {
        logger.debug("Finding snippets larger than {} characters", minSize);
        return snippetRepository.findLargeSnippets(minSize);
    }
    
    /**
     * Gets snippets without specified language
     * @return List of snippets without language
     */
    @Transactional(readOnly = true)
    public List<CodeSnippet> getSnippetsWithoutLanguage() {
        logger.debug("Finding snippets without language specification");
        return snippetRepository.findSnippetsWithoutLanguage();
    }
    
    /**
     * Updates snippet language
     * @param snippetId Snippet ID
     * @param language New language
     * @return Updated snippet
     * @throws ResourceNotFoundException if snippet doesn't exist
     */
    public CodeSnippet updateSnippetLanguage(Long snippetId, String language) {
        logger.debug("Updating language for snippet {}: {}", snippetId, language);
        CodeSnippet snippet = getSnippetById(snippetId);
        snippet.setLanguage(language);
        return snippetRepository.save(snippet);
    }
    
    /**
     * Validates a snippet before saving
     * @param snippet The snippet to validate
     * @throws IllegalArgumentException if validation fails
     */
    private void validateSnippet(CodeSnippet snippet) {
        if (snippet == null) {
            throw new IllegalArgumentException("Snippet cannot be null");
        }
        
        if (snippet.getName() == null || snippet.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Snippet name is required");
        }
        
        if (snippet.getName().length() > 200) {
            throw new IllegalArgumentException("Snippet name cannot exceed 200 characters");
        }
        
        if (snippet.getContent() != null && snippet.getContent().length() > 100000) {
            throw new IllegalArgumentException("Snippet content cannot exceed 100000 characters");
        }
        
        if (snippet.getLanguage() != null && snippet.getLanguage().length() > 50) {
            throw new IllegalArgumentException("Language cannot exceed 50 characters");
        }
        
        if (snippet.getImageUrl() != null && snippet.getImageUrl().length() > 500) {
            throw new IllegalArgumentException("Image URL cannot exceed 500 characters");
        }
    }
}
