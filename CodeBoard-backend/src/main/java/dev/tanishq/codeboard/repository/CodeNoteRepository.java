package dev.tanishq.codeboard.repository;

import dev.tanishq.codeboard.model.CodeNote;
import dev.tanishq.codeboard.model.NoteTag;
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
import java.util.Set;

/**
 * Repository interface for CodeNote entity operations.
 * Provides standard CRUD operations plus custom queries for:
 * - Full-text search across title, description, and content
 * - Filtering by tags
 * - Date-based queries
 * - Pagination support
 * - Statistics and analytics
 */
@Repository
public interface CodeNoteRepository extends JpaRepository<CodeNote, Long> {
    
    /**
     * Find a note by its ID with eager loading of snippets
     * @param id The note ID
     * @return Optional containing the note with snippets if found
     */
    @Query("SELECT n FROM CodeNote n LEFT JOIN FETCH n.snippets WHERE n.id = :id")
    Optional<CodeNote> findByIdWithSnippets(@Param("id") Long id);
    
    /**
     * Full-text search across title, description, and content
     * @param searchTerm The term to search for
     * @return List of matching notes
     */
    @Query("SELECT n FROM CodeNote n WHERE " +
           "LOWER(n.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(n.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(n.content) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<CodeNote> searchByTitleDescriptionOrContent(@Param("searchTerm") String searchTerm);
    
    /**
     * Find notes by title containing search term (case-insensitive)
     * @param title The title fragment to search for
     * @return List of matching notes
     */
    List<CodeNote> findByTitleContainingIgnoreCase(String title);
    
    /**
     * Find notes containing any of the specified tags
     * @param tags Set of tags to search for (OR condition)
     * @return List of notes with any matching tag
     */
    @Query("SELECT DISTINCT n FROM CodeNote n JOIN n.tags t WHERE t IN :tags")
    List<CodeNote> findByTagsIn(@Param("tags") Set<NoteTag> tags);
    
    /**
     * Find notes containing all of the specified tags
     * Improved SQLite-compatible version that uses grouping and counting
     * @param tags Set of tags that must all be present
     * @return List of notes containing all specified tags
     */
    @Query("SELECT n FROM CodeNote n JOIN n.tags t WHERE t IN :tags GROUP BY n.id HAVING COUNT(DISTINCT t) = :tagCount")
    List<CodeNote> findByAllTags(@Param("tags") Set<NoteTag> tags, @Param("tagCount") long tagCount);
    
    /**
     * Get all notes ordered by creation date (newest first)
     * @return List of all notes sorted by creation date
     */
    List<CodeNote> findAllByOrderByCreatedAtDesc();
    
    /**
     * Find notes with pagination support
     * @param pageable Pagination information
     * @return Page of notes
     */
    @NonNull
    Page<CodeNote> findAll(@NonNull Pageable pageable);

    /**
     * Advanced search with multiple criteria - Improved for SQLite compatibility
     * @param searchTerm Optional search term for text fields
     * @param startDate Optional minimum creation date
     * @param endDate Optional maximum creation date
     * @param pageable Pagination information
     * @return Page of matching notes
     */
    @Query("SELECT DISTINCT n FROM CodeNote n WHERE " +
           "(:searchTerm IS NULL OR " +
           " LOWER(n.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           " LOWER(n.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           " LOWER(n.content) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) AND " +
           "(:startDate IS NULL OR n.createdAt >= :startDate) AND " +
           "(:endDate IS NULL OR n.createdAt <= :endDate)")
    Page<CodeNote> findWithCriteria(
            @Param("searchTerm") String searchTerm,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            Pageable pageable
    );
    
    /**
     * Count notes by tag
     * @return List of tag and count pairs
     */
    @Query("SELECT t, COUNT(n) FROM CodeNote n JOIN n.tags t GROUP BY t ORDER BY COUNT(n) DESC")
    List<Object[]> countNotesByTag();
    
    /**
     * Find recently active notes (created or updated in last N days)
     * Improved SQLite-compatible version
     * @param sinceDate The cutoff date for recent activity
     * @return List of recently active notes
     */
    @Query("SELECT n FROM CodeNote n WHERE " +
           "n.createdAt >= :sinceDate OR n.updatedAt >= :sinceDate " +
           "ORDER BY CASE WHEN n.updatedAt > n.createdAt THEN n.updatedAt ELSE n.createdAt END DESC")
    List<CodeNote> findRecentlyActive(@Param("sinceDate") LocalDateTime sinceDate);
    
    /**
     * Find notes that don't have any tags
     * @return List of notes without tags
     */
    @Query("SELECT n FROM CodeNote n WHERE n.tags IS EMPTY")
    List<CodeNote> findNotesWithoutTags();
    
    /**
     * Count notes created per day in the given date range
     * @param startDate Start of the date range
     * @param endDate End of the date range
     * @return List of date and count pairs
     */
    @Query("SELECT FUNCTION('date', n.createdAt) as day, COUNT(n) FROM CodeNote n " +
           "WHERE n.createdAt BETWEEN :startDate AND :endDate " +
           "GROUP BY day ORDER BY day")
    List<Object[]> countNotesByCreationDate(@Param("startDate") LocalDateTime startDate, 
                                           @Param("endDate") LocalDateTime endDate);
    
    /**
     * Find notes with snippets matching the given language
     * @param language The programming language to search for
     * @return List of notes containing snippets in the specified language
     */
    @Query("SELECT DISTINCT n FROM CodeNote n JOIN n.snippets s WHERE " +
           "LOWER(s.language) = LOWER(:language)")
    List<CodeNote> findBySnippetLanguage(@Param("language") String language);
    
    /**
     * Update a note's tags
     * @param noteId ID of the note to update
     * @param tags New set of tags
     * @return Number of records updated
     */
    @Modifying
    @Query("UPDATE CodeNote n SET n.tags = :tags WHERE n.id = :noteId")
    int updateNoteTags(@Param("noteId") Long noteId, @Param("tags") Set<NoteTag> tags);
    
    /**
     * Search notes by content with pagination
     * @param searchTerm Term to search for in content
     * @param pageable Pagination information
     * @return Page of matching notes
     */
    @Query("SELECT n FROM CodeNote n WHERE LOWER(n.content) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<CodeNote> searchByContent(@Param("searchTerm") String searchTerm, Pageable pageable);
}
