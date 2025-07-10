package dev.tanishq.codeboard.repository;

import dev.tanishq.codeboard.model.CodeSnippet;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.lang.NonNull;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for CodeSnippet entity operations.
 * 
 * Provides operations for managing code snippets including:
 * - Finding snippets by note
 * - Searching snippets by language
 * - Content-based searches
 * - Analytics and statistics
 * - Pagination support
 */
@Repository
public interface CodeSnippetRepository extends JpaRepository<CodeSnippet, Long> {
    
    /**
     * Find a snippet by ID with note information
     * @param id The snippet ID
     * @return Optional containing the snippet with note if found
     */
    @Query("SELECT s FROM CodeSnippet s JOIN FETCH s.note WHERE s.id = :id")
    Optional<CodeSnippet> findByIdWithNote(@Param("id") Long id);
    
    /**
     * Find all snippets belonging to a specific note
     * @param noteId The note ID
     * @return List of snippets for the specified note
     */
    @Query("SELECT s FROM CodeSnippet s WHERE s.note.id = :noteId")
    List<CodeSnippet> findByNoteId(@Param("noteId") Long noteId);

    /**
     * Find snippets by programming language
     * @param language The programming language to search for
     * @return List of snippets in the specified language
     */
    List<CodeSnippet> findByLanguageIgnoreCase(String language);
    
    /**
     * Find snippets by name containing search term (case-insensitive)
     * @param name The name fragment to search for
     * @return List of snippets with matching names
     */
    List<CodeSnippet> findByNameContainingIgnoreCase(String name);
    
    /**
     * Search snippets by content
     * @param searchTerm The term to search for in content
     * @return List of snippets with matching content
     */
    @Query("SELECT s FROM CodeSnippet s WHERE " +
           "LOWER(s.content) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<CodeSnippet> searchByContent(@Param("searchTerm") String searchTerm);
    
    /**
     * Search snippets by content with pagination
     * @param searchTerm The term to search for in content
     * @param pageable Pagination information
     * @return Page of matching snippets
     */
    @Query("SELECT s FROM CodeSnippet s WHERE " +
           "LOWER(s.content) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<CodeSnippet> searchByContent(@Param("searchTerm") String searchTerm, Pageable pageable);
    
    /**
     * Find all snippets ordered by creation date (newest first)
     * @return List of all snippets ordered by creation date
     */
    List<CodeSnippet> findAllByOrderByCreatedAtDesc();
    
    /**
     * Find snippets with pagination
     * @param pageable Pagination information
     * @return Page of snippets
     */
    @NonNull
    Page<CodeSnippet> findAll(@NonNull Pageable pageable);
    
    /**
     * Find snippets by note ordered by creation date
     * @param noteId The note ID
     * @return List of snippets for the specified note ordered by creation date
     */
    @Query("SELECT s FROM CodeSnippet s WHERE s.note.id = :noteId ORDER BY s.createdAt ASC")
    List<CodeSnippet> findByNoteIdOrderByCreatedAtAsc(@Param("noteId") Long noteId);

    /**
     * Get count of snippets per language
     * @return List of language and count pairs
     */
    @Query("SELECT s.language, COUNT(s) FROM CodeSnippet s " +
           "WHERE s.language IS NOT NULL " +
           "GROUP BY s.language " +
           "ORDER BY COUNT(s) DESC")
    List<Object[]> countSnippetsByLanguage();
    
    /**
     * Find recently created snippets
     * @param sinceDate The cutoff date
     * @return List of recently created snippets
     */
    @Query("SELECT s FROM CodeSnippet s WHERE s.createdAt >= :sinceDate ORDER BY s.createdAt DESC")
    List<CodeSnippet> findRecentlyCreated(@Param("sinceDate") LocalDateTime sinceDate);
    
    /**
     * Find snippets with content larger than specified size
     * @param minLength Minimum content length
     * @return List of snippets with large content
     */
    @Query("SELECT s FROM CodeSnippet s WHERE LENGTH(s.content) > :minLength ORDER BY LENGTH(s.content) DESC")
    List<CodeSnippet> findLargeSnippets(@Param("minLength") int minLength);
    
    /**
     * Find snippets without a specified language
     * @return List of snippets without language specification
     */
    @Query("SELECT s FROM CodeSnippet s WHERE s.language IS NULL OR s.language = ''")
    List<CodeSnippet> findSnippetsWithoutLanguage();
    
    /**
     * Update snippet language
     * @param snippetId The snippet ID
     * @param language The new language
     * @return Number of records updated
     */
    @Modifying
    @Query("UPDATE CodeSnippet s SET s.language = :language WHERE s.id = :snippetId")
    int updateSnippetLanguage(@Param("snippetId") Long snippetId, @Param("language") String language);
    
    /**
     * Find snippets for a list of notes
     * @param noteIds List of note IDs
     * @return List of snippets belonging to the specified notes
     */
    @Query("SELECT s FROM CodeSnippet s WHERE s.note.id IN :noteIds")
    List<CodeSnippet> findByNoteIdIn(@Param("noteIds") List<Long> noteIds);
    
    /**
     * Delete all snippets for a note
     * @param noteId The note ID
     * @return Number of records deleted
     */
    @Modifying
    @Query("DELETE FROM CodeSnippet s WHERE s.note.id = :noteId")
    int deleteByNoteId(@Param("noteId") Long noteId);
}
