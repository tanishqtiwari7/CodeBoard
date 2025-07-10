package dev.tanishq.codeboard.controller;

import dev.tanishq.codeboard.model.CodeSnippet;
import dev.tanishq.codeboard.service.CodeSnippetService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * REST Controller for managing CodeSnippet entities.
 * <p>
 * Provides RESTful endpoints for:
 * - Creating, reading, updating, and deleting code snippets
 * - Searching and filtering snippets by various criteria
 * - Managing snippet relationships with notes
 * - Retrieving snippet statistics and analytics
 * </p>
 */
@RestController
@RequestMapping("/api/snippets")
@Validated
@Tag(name = "Code Snippets", description = "API for managing code snippets")
public class CodeSnippetController {
    
    private final CodeSnippetService snippetService;

    @Autowired
    public CodeSnippetController(CodeSnippetService snippetService) {
        this.snippetService = snippetService;
    }

    /**
     * Get all snippets with optional pagination
     * 
     * @param page Optional page number (0-based)
     * @param size Optional page size
     * @param sortBy Optional field to sort by
     * @param sortDir Optional sort direction (asc/desc)
     * @return List of code snippets
     */
    @Operation(summary = "Get all snippets", description = "Retrieves all code snippets with optional pagination and sorting")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Successfully retrieved snippets"),
        @ApiResponse(responseCode = "400", description = "Invalid pagination parameters")
    })
    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getAllSnippets(
            @Parameter(description = "Page number (0-based)") 
            @RequestParam(required = false) Integer page,
            
            @Parameter(description = "Page size") 
            @RequestParam(required = false) @Min(1) @Max(100) Integer size,
            
            @Parameter(description = "Field to sort by") 
            @RequestParam(defaultValue = "createdAt") String sortBy,
            
            @Parameter(description = "Sort direction (asc/desc)") 
            @RequestParam(defaultValue = "desc") @Pattern(regexp = "asc|desc", message = "Sort direction must be 'asc' or 'desc'") 
            String sortDir) {
        
        if (page != null && size != null) {
            Page<CodeSnippet> snippets = snippetService.getAllSnippets(page, size, sortBy, sortDir);
            
            Map<String, Object> response = new HashMap<>();
            response.put("snippets", snippets.getContent());
            response.put("currentPage", snippets.getNumber());
            response.put("totalItems", snippets.getTotalElements());
            response.put("totalPages", snippets.getTotalPages());
            
            return ResponseEntity.ok(response);
        } else {
            List<CodeSnippet> snippets = snippetService.getAllSnippets();
            return ResponseEntity.ok(snippets);
        }
    }

    /**
     * Get a specific snippet by ID
     * 
     * @param id Snippet ID
     * @param includeNote Whether to include the parent note details
     * @return The snippet
     */
    @Operation(summary = "Get snippet by ID", description = "Retrieves a specific snippet by its ID")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Successfully retrieved snippet", 
                    content = @Content(schema = @Schema(implementation = CodeSnippet.class))),
        @ApiResponse(responseCode = "404", description = "Snippet not found")
    })
    @GetMapping(path = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CodeSnippet> getSnippetById(
            @Parameter(description = "Snippet ID", required = true) 
            @PathVariable Long id,
            
            @Parameter(description = "Whether to include parent note details") 
            @RequestParam(defaultValue = "false") boolean includeNote) {
        
        CodeSnippet snippet = includeNote 
            ? snippetService.getSnippetWithNote(id)
            : snippetService.getSnippetById(id);
            
        return ResponseEntity.ok(snippet);
    }

    /**
     * Get all snippets for a specific note
     * 
     * @param noteId Note ID
     * @return List of snippets belonging to the note
     */
    @Operation(summary = "Get snippets by note", description = "Retrieves all snippets associated with a specific note")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Successfully retrieved snippets"),
        @ApiResponse(responseCode = "404", description = "Note not found")
    })
    @GetMapping(path = "/note/{noteId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<CodeSnippet>> getSnippetsByNote(
            @Parameter(description = "Note ID", required = true) 
            @PathVariable Long noteId) {
        
        List<CodeSnippet> snippets = snippetService.getSnippetsByNote(noteId);
        return ResponseEntity.ok(snippets);
    }

    /**
     * Get snippets by programming language
     * 
     * @param language Programming language
     * @return List of snippets in the specified language
     */
    @Operation(summary = "Get snippets by language", description = "Retrieves all snippets written in a specific programming language")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved snippets")
    @GetMapping(path = "/language/{language}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<CodeSnippet>> getSnippetsByLanguage(
            @Parameter(description = "Programming language", required = true) 
            @PathVariable String language) {
        
        List<CodeSnippet> snippets = snippetService.getSnippetsByLanguage(language);
        return ResponseEntity.ok(snippets);
    }

    /**
     * Search snippets by name
     * 
     * @param q Search query
     * @return List of matching snippets
     */
    @Operation(summary = "Search snippets by name", description = "Searches for snippets with names containing the search query")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved matching snippets")
    @GetMapping(path = "/search/name", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<CodeSnippet>> searchSnippetsByName(
            @Parameter(description = "Search query", required = true) 
            @RequestParam String q) {
        
        List<CodeSnippet> snippets = snippetService.searchSnippetsByName(q);
        return ResponseEntity.ok(snippets);
    }

    /**
     * Search snippets by content
     * 
     * @param q Search query
     * @param page Optional page number
     * @param size Optional page size
     * @return List or page of matching snippets
     */
    @Operation(summary = "Search snippets by content", description = "Searches for snippets with content containing the search query")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved matching snippets")
    @GetMapping(path = "/search/content", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> searchSnippetsByContent(
            @Parameter(description = "Search query", required = true) 
            @RequestParam String q,
            
            @Parameter(description = "Page number (0-based)") 
            @RequestParam(required = false) Integer page,
            
            @Parameter(description = "Page size") 
            @RequestParam(required = false) @Min(1) @Max(100) Integer size) {
        
        if (page != null && size != null) {
            Page<CodeSnippet> snippets = snippetService.searchSnippetsByContent(q, page, size);
            
            Map<String, Object> response = new HashMap<>();
            response.put("snippets", snippets.getContent());
            response.put("currentPage", snippets.getNumber());
            response.put("totalItems", snippets.getTotalElements());
            response.put("totalPages", snippets.getTotalPages());
            
            return ResponseEntity.ok(response);
        } else {
            List<CodeSnippet> snippets = snippetService.searchSnippetsByContent(q);
            return ResponseEntity.ok(snippets);
        }
    }

    /**
     * Create a new snippet
     * 
     * @param snippet The snippet to create
     * @return The created snippet
     */
    @Operation(summary = "Create a new snippet", description = "Creates a new code snippet")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Snippet successfully created"),
        @ApiResponse(responseCode = "400", description = "Invalid snippet data"),
        @ApiResponse(responseCode = "404", description = "Parent note not found")
    })
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CodeSnippet> createSnippet(
            @Parameter(description = "Snippet to create", required = true) 
            @Valid @RequestBody CodeSnippet snippet) {
        
        CodeSnippet savedSnippet = snippetService.createSnippet(snippet);
        return new ResponseEntity<>(savedSnippet, HttpStatus.CREATED);
    }

    /**
     * Update an existing snippet
     * 
     * @param id Snippet ID
     * @param snippet Updated snippet data
     * @return The updated snippet
     */
    @Operation(summary = "Update a snippet", description = "Updates an existing code snippet")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Snippet successfully updated"),
        @ApiResponse(responseCode = "400", description = "Invalid snippet data"),
        @ApiResponse(responseCode = "404", description = "Snippet not found")
    })
    @PutMapping(path = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CodeSnippet> updateSnippet(
            @Parameter(description = "Snippet ID", required = true) 
            @PathVariable Long id,
            
            @Parameter(description = "Updated snippet data", required = true) 
            @Valid @RequestBody CodeSnippet snippet) {
        
        CodeSnippet updatedSnippet = snippetService.updateSnippet(id, snippet);
        return ResponseEntity.ok(updatedSnippet);
    }

    /**
     * Delete a snippet
     * 
     * @param id Snippet ID
     * @return Success response with deletion info
     */
    @Operation(summary = "Delete a snippet", description = "Deletes a specific code snippet")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Snippet successfully deleted"),
        @ApiResponse(responseCode = "404", description = "Snippet not found")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteSnippet(
            @Parameter(description = "Snippet ID", required = true) 
            @PathVariable Long id) {
        
        snippetService.deleteSnippet(id);
        
        Map<String, Object> response = Map.of(
            "message", "Snippet deleted successfully",
            "id", id,
            "timestamp", LocalDateTime.now()
        );
        
        return ResponseEntity.ok(response);
    }

    /**
     * Get statistics about snippets
     * 
     * @return Statistics data
     */
    @Operation(summary = "Get snippet statistics", description = "Retrieves statistics about code snippets")
    @ApiResponse(responseCode = "200", description = "Statistics successfully retrieved")
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getSnippetStatistics() {
        List<Object[]> languageStats = snippetService.getSnippetCountByLanguage();
        long totalSnippets = snippetService.getAllSnippets().size();
        
        Map<String, Object> stats = Map.of(
            "totalSnippets", totalSnippets,
            "languageDistribution", languageStats,
            "lastUpdated", LocalDateTime.now()
        );
        
        return ResponseEntity.ok(stats);
    }

    /**
     * Move a snippet to a different note
     * 
     * @param snippetId Snippet ID
     * @param newNoteId New parent note ID
     * @return The updated snippet
     */
    @Operation(summary = "Move snippet to another note", description = "Moves a snippet to a different parent note")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Snippet successfully moved"),
        @ApiResponse(responseCode = "404", description = "Snippet or note not found")
    })
    @PutMapping("/{snippetId}/move/{newNoteId}")
    public ResponseEntity<CodeSnippet> moveSnippetToNote(
            @Parameter(description = "Snippet ID", required = true) 
            @PathVariable Long snippetId,
            
            @Parameter(description = "New parent note ID", required = true) 
            @PathVariable Long newNoteId) {
        
        CodeSnippet updatedSnippet = snippetService.moveSnippetToNote(snippetId, newNoteId);
        return ResponseEntity.ok(updatedSnippet);
    }
    
    /**
     * Get snippets without language specification
     * 
     * @return List of snippets without language
     */
    @Operation(summary = "Get snippets without language", description = "Retrieves all snippets without language specification")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved snippets")
    @GetMapping("/without-language")
    public ResponseEntity<List<CodeSnippet>> getSnippetsWithoutLanguage() {
        List<CodeSnippet> snippets = snippetService.getSnippetsWithoutLanguage();
        return ResponseEntity.ok(snippets);
    }
    
    /**
     * Get recently created snippets
     * 
     * @param days Number of days to look back (default 7)
     * @return List of recently created snippets
     */
    @Operation(summary = "Get recent snippets", description = "Retrieves snippets created within the specified number of days")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved snippets")
    @GetMapping("/recent")
    public ResponseEntity<List<CodeSnippet>> getRecentSnippets(
            @Parameter(description = "Number of days to look back") 
            @RequestParam(defaultValue = "7") @Min(1) @Max(365) int days) {
        
        List<CodeSnippet> snippets = snippetService.getRecentlyCreatedSnippets(days);
        return ResponseEntity.ok(snippets);
    }
    
    /**
     * Get large snippets
     * 
     * @param minSize Minimum content size in characters
     * @return List of large snippets
     */
    @Operation(summary = "Get large snippets", description = "Retrieves snippets with content exceeding the specified size")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved snippets")
    @GetMapping("/large")
    public ResponseEntity<List<CodeSnippet>> getLargeSnippets(
            @Parameter(description = "Minimum content size in characters") 
            @RequestParam(defaultValue = "1000") @Min(100) int minSize) {
        
        List<CodeSnippet> snippets = snippetService.getLargeSnippets(minSize);
        return ResponseEntity.ok(snippets);
    }
    
    /**
     * Update snippet language
     * 
     * @param snippetId Snippet ID
     * @param language New language
     * @return The updated snippet
     */
    @Operation(summary = "Update snippet language", description = "Updates the language of a specific snippet")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Language successfully updated"),
        @ApiResponse(responseCode = "404", description = "Snippet not found")
    })
    @PatchMapping("/{snippetId}/language")
    public ResponseEntity<CodeSnippet> updateSnippetLanguage(
            @Parameter(description = "Snippet ID", required = true) 
            @PathVariable Long snippetId,
            
            @Parameter(description = "New language", required = true) 
            @RequestBody Map<String, String> payload) {
        
        String language = payload.get("language");
        if (language == null || language.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        CodeSnippet updatedSnippet = snippetService.updateSnippetLanguage(snippetId, language);
        return ResponseEntity.ok(updatedSnippet);
    }
}

