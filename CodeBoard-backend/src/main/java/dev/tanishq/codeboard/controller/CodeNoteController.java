package dev.tanishq.codeboard.controller;

import dev.tanishq.codeboard.model.CodeNote;
import dev.tanishq.codeboard.model.NoteTag;
import dev.tanishq.codeboard.service.CodeNoteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * REST Controller for managing CodeNote entities.
 * 
 * Provides endpoints for:
 * - CRUD operations on notes
 * - Search and filtering functionality
 * - Tag management
 * - Statistics and analytics
 */
@RestController
@RequestMapping("/api/codenotes")
@CrossOrigin(origins = {
    "http://localhost:3000", 
    "http://localhost:5173", 
    "http://localhost:4173",
    "http://localhost:4000",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:4173",
    "http://127.0.0.1:4000"
})
@Tag(name = "Code Notes", description = "API for managing code notes")
public class CodeNoteController {
    
    private static final Logger logger = LoggerFactory.getLogger(CodeNoteController.class);
    
    private final CodeNoteService codeNoteService;

    @Autowired
    public CodeNoteController(CodeNoteService codeNoteService) {
        this.codeNoteService = codeNoteService;
    }

    /**
     * Get all notes with optional pagination
     * 
     * @param page Page number (default: 0)
     * @param size Page size (default: 20)
     * @param sortBy Field to sort by (default: createdAt)
     * @param sortDirection Sort direction (default: desc)
     * @param paginated Whether to use pagination (default: false)
     * @return List or page of notes
     */
    @Operation(
        summary = "Get all code notes",
        description = "Retrieve all code notes with optional pagination",
        responses = {
            @ApiResponse(responseCode = "200", description = "Notes retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
        }
    )
    @GetMapping
    public ResponseEntity<?> getAllNotes(
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size,
            @Parameter(description = "Field to sort by") @RequestParam(defaultValue = "createdAt") String sortBy,
            @Parameter(description = "Sort direction (asc/desc)") @RequestParam(defaultValue = "desc") String sortDirection,
            @Parameter(description = "Enable pagination") @RequestParam(defaultValue = "false") boolean paginated) {
        
        logger.debug("GET /api/codenotes - getAllNotes: paginated={}, page={}, size={}", paginated, page, size);
        
        try {
            if (paginated) {
                Page<CodeNote> notePage = codeNoteService.getAllNotes(page, size, sortBy, sortDirection);
                return ResponseEntity.ok(notePage);
            } else {
                List<CodeNote> notes = codeNoteService.getAllNotes();
                return ResponseEntity.ok(notes);
            }
        } catch (Exception e) {
            logger.error("Error fetching notes: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to retrieve notes", "message", e.getMessage()));
        }
    }

    /**
     * Get a specific note by ID
     * 
     * @param id Note ID
     * @param withSnippets Whether to include snippets (default: false)
     * @return The requested note
     */
    @Operation(
        summary = "Get note by ID",
        description = "Retrieve a specific code note by its ID",
        responses = {
            @ApiResponse(responseCode = "200", description = "Note retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Note not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
        }
    )
    @GetMapping("/{id}")
    public ResponseEntity<CodeNote> getNoteById(
            @Parameter(description = "Note ID") @PathVariable Long id,
            @Parameter(description = "Include snippets in response") @RequestParam(defaultValue = "false") boolean withSnippets) {
        
        logger.debug("GET /api/codenotes/{} - getNoteById: withSnippets={}", id, withSnippets);
        
        CodeNote note = withSnippets 
            ? codeNoteService.getNoteWithSnippets(id)
            : codeNoteService.getNoteById(id);
            
        return ResponseEntity.ok(note);
    }

    /**
     * Create a new note
     * 
     * @param note Note to create
     * @return The created note
     */
    @Operation(
        summary = "Create new note",
        description = "Create a new code note",
        responses = {
            @ApiResponse(responseCode = "201", description = "Note created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
        }
    )
    @PostMapping
    public ResponseEntity<CodeNote> createNote(
            @Parameter(description = "Note to create", 
                       required = true, 
                       content = @Content(schema = @Schema(implementation = CodeNote.class)))
            @Valid @RequestBody CodeNote note) {
        
        logger.debug("POST /api/codenotes - createNote: {}", note.getTitle());
        
        CodeNote createdNote = codeNoteService.createNote(note);
        return new ResponseEntity<>(createdNote, HttpStatus.CREATED);
    }

    /**
     * Update an existing note
     * 
     * @param id Note ID
     * @param note Note data to update
     * @return The updated note
     */
    @Operation(
        summary = "Update note",
        description = "Update an existing code note by its ID",
        responses = {
            @ApiResponse(responseCode = "200", description = "Note updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input"),
            @ApiResponse(responseCode = "404", description = "Note not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
        }
    )
    @PutMapping("/{id}")
    public ResponseEntity<CodeNote> updateNote(
            @Parameter(description = "Note ID") @PathVariable Long id,
            @Parameter(description = "Updated note data", 
                      required = true, 
                      content = @Content(schema = @Schema(implementation = CodeNote.class)))
            @Valid @RequestBody CodeNote note) {
        
        logger.debug("PUT /api/codenotes/{} - updateNote", id);
        
        CodeNote updatedNote = codeNoteService.updateNote(id, note);
        return ResponseEntity.ok(updatedNote);
    }

    /**
     * Delete a note
     * 
     * @param id Note ID to delete
     * @return Success message with metadata
     */
    @Operation(
        summary = "Delete note",
        description = "Delete a code note by its ID",
        responses = {
            @ApiResponse(responseCode = "200", description = "Note deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Note not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
        }
    )
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteNote(
            @Parameter(description = "Note ID") @PathVariable Long id) {
        
        logger.debug("DELETE /api/codenotes/{} - deleteNote", id);
        
        codeNoteService.deleteNote(id);
        
        Map<String, Object> response = Map.of(
            "message", "Note deleted successfully",
            "id", id,
            "timestamp", LocalDateTime.now()
        );
        
        return ResponseEntity.ok(response);
    }

    /**
     * Search notes by text content
     * 
     * @param q Search term
     * @return List of matching notes
     */
    @Operation(
        summary = "Search notes",
        description = "Search for notes by text in title, description, or content",
        responses = {
            @ApiResponse(responseCode = "200", description = "Search completed successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
        }
    )
    @GetMapping("/search")
    public ResponseEntity<List<CodeNote>> searchNotes(
            @Parameter(description = "Search term") @RequestParam String q) {
        
        logger.debug("GET /api/codenotes/search - searchNotes: q={}", q);
        
        List<CodeNote> notes = codeNoteService.searchNotes(q);
        return ResponseEntity.ok(notes);
    }

    /**
     * Advanced search with multiple criteria
     * 
     * @param q Search term (optional)
     * @param tags Comma-separated list of tags (optional)
     * @param startDate Minimum creation date (optional)
     * @param endDate Maximum creation date (optional)
     * @param page Page number (default: 0)
     * @param size Page size (default: 20)
     * @param sortBy Field to sort by (default: createdAt)
     * @param sortDirection Sort direction (default: desc)
     * @return Page of matching notes
     */
    @Operation(
        summary = "Advanced search",
        description = "Search notes with multiple criteria and filters",
        responses = {
            @ApiResponse(responseCode = "200", description = "Search completed successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input parameters"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
        }
    )
    @GetMapping("/search/advanced")
    public ResponseEntity<Page<CodeNote>> advancedSearch(
            @Parameter(description = "Search term") @RequestParam(required = false) String q,
            @Parameter(description = "Comma-separated list of tags") @RequestParam(required = false) String tags,
            @Parameter(description = "Minimum creation date (ISO format)") 
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @Parameter(description = "Maximum creation date (ISO format)") 
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size,
            @Parameter(description = "Field to sort by") @RequestParam(defaultValue = "createdAt") String sortBy,
            @Parameter(description = "Sort direction (asc/desc)") @RequestParam(defaultValue = "desc") String sortDirection) {
        
        logger.debug("GET /api/codenotes/search/advanced - advancedSearch: q={}, tags={}, startDate={}, endDate={}", 
                    q, tags, startDate, endDate);
        
        // Parse tags
        Set<NoteTag> tagSet = null;
        if (tags != null && !tags.trim().isEmpty()) {
            try {
                tagSet = Arrays.stream(tags.split(","))
                        .map(String::trim)
                        .map(String::toUpperCase)
                        .map(NoteTag::valueOf)
                        .collect(Collectors.toSet());
            } catch (IllegalArgumentException e) {
                logger.warn("Invalid tag in search request: {}", e.getMessage());
                // Continue with null tagSet - will return all notes
            }
        }
        
        Page<CodeNote> notes = codeNoteService.searchNotesWithCriteria(
            q, tagSet, startDate, endDate, page, size, sortBy, sortDirection
        );
        
        return ResponseEntity.ok(notes);
    }

    /**
     * Get notes by specific tags
     * 
     * @param tags Comma-separated list of tags
     * @param requireAll Whether all tags must be present (default: false)
     * @return List of notes with matching tags
     */
    @Operation(
        summary = "Get notes by tags",
        description = "Filter notes by one or more tags",
        responses = {
            @ApiResponse(responseCode = "200", description = "Notes retrieved successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid tag format"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
        }
    )
    @GetMapping("/by-tags")
    public ResponseEntity<List<CodeNote>> getNotesByTags(
            @Parameter(description = "Comma-separated list of tags") @RequestParam String tags,
            @Parameter(description = "Whether all tags must be present") @RequestParam(defaultValue = "false") boolean requireAll) {
        
        logger.debug("GET /api/codenotes/by-tags - getNotesByTags: tags={}, requireAll={}", tags, requireAll);
        
        try {
            Set<NoteTag> tagSet = Arrays.stream(tags.split(","))
                    .map(String::trim)
                    .map(String::toUpperCase)
                    .map(NoteTag::valueOf)
                    .collect(Collectors.toSet());
            
            List<CodeNote> notes = requireAll 
                ? codeNoteService.getNotesByAllTags(tagSet)
                : codeNoteService.getNotesByTags(tagSet);
                
            return ResponseEntity.ok(notes);
        } catch (IllegalArgumentException e) {
            logger.warn("Invalid tag requested: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Find notes by title
     * 
     * @param title Title search term
     * @return List of notes with matching titles
     */
    @Operation(
        summary = "Find notes by title",
        description = "Search for notes by title (case-insensitive)",
        responses = {
            @ApiResponse(responseCode = "200", description = "Search completed successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
        }
    )
    @GetMapping("/by-title")
    public ResponseEntity<List<CodeNote>> getNotesByTitle(
            @Parameter(description = "Title search term") @RequestParam String title) {
        
        logger.debug("GET /api/codenotes/by-title - getNotesByTitle: title={}", title);
        
        List<CodeNote> notes = codeNoteService.findByTitleContaining(title);
        return ResponseEntity.ok(notes);
    }
    
    /**
     * Find notes without tags
     * 
     * @return List of notes without any tags
     */
    @Operation(
        summary = "Get notes without tags",
        description = "Find all notes that don't have any tags assigned",
        responses = {
            @ApiResponse(responseCode = "200", description = "Notes retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
        }
    )
    @GetMapping("/untagged")
    public ResponseEntity<List<CodeNote>> getUntaggedNotes() {
        logger.debug("GET /api/codenotes/untagged - getUntaggedNotes");
        
        List<CodeNote> notes = codeNoteService.getNotesWithoutTags();
        return ResponseEntity.ok(notes);
    }

    /**
     * Get recently active notes
     * 
     * @param days Number of days to look back (default: 7)
     * @return List of recently active notes
     */
    @Operation(
        summary = "Get recent notes",
        description = "Get notes that were created or updated in the last N days",
        responses = {
            @ApiResponse(responseCode = "200", description = "Notes retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
        }
    )
    @GetMapping("/recent")
    public ResponseEntity<List<CodeNote>> getRecentNotes(
            @Parameter(description = "Number of days to look back") @RequestParam(defaultValue = "7") int days) {
        
        logger.debug("GET /api/codenotes/recent - getRecentNotes: days={}", days);
        
        List<CodeNote> notes = codeNoteService.getRecentlyActiveNotes(days);
        return ResponseEntity.ok(notes);
    }

    /**
     * Get all available tags with their metadata
     * 
     * @return List of all tags with metadata
     */
    @Operation(
        summary = "Get all tags",
        description = "Get all available note tags with metadata",
        responses = {
            @ApiResponse(responseCode = "200", description = "Tags retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
        }
    )
    @GetMapping("/tags")
    public ResponseEntity<List<Map<String, Object>>> getAllTags() {
        logger.debug("GET /api/codenotes/tags - getAllTags");
        
        List<Map<String, Object>> tags = Arrays.stream(NoteTag.values())
                .map(tag -> {
                    Map<String, Object> tagMap = new HashMap<>();
                    tagMap.put("name", tag.name());
                    tagMap.put("displayName", tag.getDisplayName());
                    tagMap.put("emoji", tag.getEmoji());
                    tagMap.put("description", tag.getDescription());
                    tagMap.put("displayWithEmoji", tag.getDisplayWithEmoji());
                    return tagMap;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(tags);
    }

    /**
     * Get development-related tags
     * 
     * @return Array of development tags
     */
    @Operation(
        summary = "Get development tags",
        description = "Get tags related to development categories",
        responses = {
            @ApiResponse(responseCode = "200", description = "Tags retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
        }
    )
    @GetMapping("/tags/development")
    public ResponseEntity<NoteTag[]> getDevelopmentTags() {
        logger.debug("GET /api/codenotes/tags/development - getDevelopmentTags");
        return ResponseEntity.ok(NoteTag.getDevelopmentTags());
    }

    /**
     * Get learning-related tags
     * 
     * @return Array of learning tags
     */
    @Operation(
        summary = "Get learning tags",
        description = "Get tags related to learning and documentation",
        responses = {
            @ApiResponse(responseCode = "200", description = "Tags retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
        }
    )
    @GetMapping("/tags/learning")
    public ResponseEntity<NoteTag[]> getLearningTags() {
        logger.debug("GET /api/codenotes/tags/learning - getLearningTags");
        return ResponseEntity.ok(NoteTag.getLearningTags());
    }

    /**
     * Get statistics about notes
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStatistics() {
        List<Object[]> tagStats = codeNoteService.getNoteStatsByTag();
        List<CodeNote> recentNotes = codeNoteService.getRecentlyActiveNotes(7);
        List<CodeNote> allNotes = codeNoteService.getAllNotes();
        
        Map<String, Object> stats = Map.of(
            "totalNotes", allNotes.size(),
            "recentlyActive", recentNotes.size(),
            "tagDistribution", tagStats,
            "lastUpdated", LocalDateTime.now()
        );
        
        return ResponseEntity.ok(stats);
    }
}
