package dev.tanishq.codeboard.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Entity representing a code note in the CodeBoard system.
 * 
 * A CodeNote contains:
 * - Basic information (title, description)
 * - Main content (code, documentation, etc.)
 * - Categorization through tags
 * - Associated code snippets
 * - Audit fields (creation and modification timestamps)
 * 
 * This is the core entity of the application that stores user code notes.
 */
@Entity
@Table(name = "code_notes", indexes = {
    @Index(name = "idx_code_notes_title", columnList = "title"),
    @Index(name = "idx_code_notes_created_at", columnList = "created_at")
})
@EntityListeners(AuditingEntityListener.class)
public class CodeNote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must not exceed 200 characters")
    @Column(nullable = false, length = 200)
    private String title;
    
    @Enumerated(EnumType.STRING)
    @ElementCollection(targetClass = NoteTag.class, fetch = FetchType.EAGER)
    @CollectionTable(name = "note_tags", joinColumns = @JoinColumn(name = "note_id"))
    @Column(name = "tag")
    private Set<NoteTag> tags = new HashSet<>();

    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    @Column(length = 1000)
    private String description;

    @Size(max = 50000, message = "Content must not exceed 50000 characters")
    @Column(length = 50000, columnDefinition = "TEXT")
    private String content;

    @OneToMany(mappedBy = "note", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<CodeSnippet> snippets = new ArrayList<>();

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // Constructors
    public CodeNote() {}

    public CodeNote(String title, Set<NoteTag> tags, String description, String content) {
        this.title = title;
        this.tags = tags != null ? tags : new HashSet<>();
        this.description = description;
        this.content = content;
    }

    // Utility methods
    
    /**
     * Adds a tag to this note if not already present
     * @param tag The tag to add
     */
    public void addTag(NoteTag tag) {
        if (tag != null) {
            this.tags.add(tag);
        }
    }
    
    /**
     * Removes a tag from this note
     * @param tag The tag to remove
     */
    public void removeTag(NoteTag tag) {
        this.tags.remove(tag);
    }
    
    /**
     * Checks if this note has a specific tag
     * @param tag The tag to check for
     * @return true if the note has the tag, false otherwise
     */
    public boolean hasTag(NoteTag tag) {
        return this.tags.contains(tag);
    }
    
    /**
     * Adds multiple tags to this note
     * @param tags Set of tags to add
     */
    public void addTags(Set<NoteTag> tags) {
        if (tags != null) {
            this.tags.addAll(tags);
        }
    }
    
    /**
     * Gets a preview of the content (first 150 characters)
     * @return A preview string of the note's content
     */
    public String getContentPreview() {
        if (content == null || content.trim().isEmpty()) {
            return description != null && !description.trim().isEmpty() 
                ? description.substring(0, Math.min(150, description.length())) 
                : "(No content)";
        }
        
        String preview = content.substring(0, Math.min(150, content.length()));
        return content.length() > 150 ? preview + "..." : preview;
    }
    
    /**
     * Gets a list of tag names as strings
     * @return List of tag names
     */
    public List<String> getTagNames() {
        return tags.stream()
            .map(Enum::name)
            .collect(Collectors.toList());
    }
    
    /**
     * Gets a list of tags with emoji representation
     * @return List of tag display names with emoji
     */
    public List<String> getTagsWithEmoji() {
        return tags.stream()
            .map(NoteTag::getDisplayWithEmoji)
            .collect(Collectors.toList());
    }
    
    /**
     * Gets the count of snippets associated with this note
     * @return The number of code snippets
     */
    public int getSnippetCount() {
        return snippets != null ? snippets.size() : 0;
    }
    
    /**
     * Adds a snippet to this note and sets up the relationship
     * @param snippet The snippet to add
     */
    public void addSnippet(CodeSnippet snippet) {
        if (snippet != null) {
            if (snippets == null) {
                snippets = new ArrayList<>();
            }
            snippet.setNote(this);
            snippets.add(snippet);
        }
    }

    // Getters and Setters

    public Long getId() { 
        return id; 
    }

    public void setId(Long id) { 
        this.id = id; 
    }

    public String getTitle() { 
        return title; 
    }

    public void setTitle(String title) { 
        this.title = title; 
    }

    public Set<NoteTag> getTags() { 
        return tags; 
    }

    public void setTags(Set<NoteTag> tags) { 
        this.tags = tags != null ? tags : new HashSet<>(); 
    }

    public String getDescription() { 
        return description; 
    }

    public void setDescription(String description) { 
        this.description = description; 
    }

    public String getContent() { 
        return content; 
    }

    public void setContent(String content) { 
        this.content = content; 
    }

    public List<CodeSnippet> getSnippets() { 
        return snippets; 
    }

    public void setSnippets(List<CodeSnippet> snippets) { 
        if (snippets != null) {
            this.snippets.clear();
            snippets.forEach(this::addSnippet);
        }
    }

    public LocalDateTime getCreatedAt() { 
        return createdAt; 
    }

    public LocalDateTime getUpdatedAt() { 
        return updatedAt; 
    }

    @Override
    public String toString() {
        return "CodeNote{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", tags=" + tags +
                ", snippetCount=" + getSnippetCount() +
                ", createdAt=" + createdAt +
                '}';
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        
        CodeNote other = (CodeNote) o;
        return id != null && id.equals(other.getId());
    }
    
    @Override
    public int hashCode() {
        return id != null ? id.hashCode() : 0;
    }
}
