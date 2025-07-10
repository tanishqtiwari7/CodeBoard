package dev.tanishq.codeboard.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Pattern;

/**
 * Entity representing a code snippet within a CodeNote.
 * 
 * CodeSnippets are child entities of CodeNote and contain:
 * - Name/title of the snippet
 * - Programming language
 * - The actual code content
 * - Optional image URL for visual references
 * - Audit fields for tracking changes
 * 
 * This entity represents reusable code fragments that can be attached to notes.
 */
@Entity
@Table(name = "code_snippets", indexes = {
    @Index(name = "idx_code_snippets_note_id", columnList = "code_note_id"),
    @Index(name = "idx_code_snippets_language", columnList = "language")
})
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@ToString(exclude = "note")
@EqualsAndHashCode(exclude = "note")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CodeSnippet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Snippet name is required")
    @Size(max = 200, message = "Name must not exceed 200 characters")
    @Column(nullable = false, length = 200)
    private String name;

    @Size(max = 50, message = "Language must not exceed 50 characters")
    @Column(length = 50)
    private String language;

    @Size(max = 100000, message = "Content must not exceed 100000 characters")
    @Column(length = 100000, columnDefinition = "TEXT")
    private String content;

    @Size(max = 1000, message = "Image URL must not exceed 1000 characters")
    @Column(length = 1000)
    private String imageUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "code_note_id")
    @JsonBackReference
    private CodeNote note;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    // Common languages for syntax highlighting
    private static final Map<String, Pattern> LANGUAGE_PATTERNS = new HashMap<>();
    
    static {
        // Initialize language detection patterns
        LANGUAGE_PATTERNS.put("java", Pattern.compile("(public class|import java\\.|System\\.out|@Override)", Pattern.CASE_INSENSITIVE));
        LANGUAGE_PATTERNS.put("python", Pattern.compile("(def\\s+\\w+\\s*\\(|import\\s+\\w+|from\\s+\\w+\\s+import)", Pattern.CASE_INSENSITIVE));
        LANGUAGE_PATTERNS.put("javascript", Pattern.compile("(function\\s+\\w+\\s*\\(|const\\s+\\w+\\s*=|let\\s+\\w+\\s*=|=>)", Pattern.CASE_INSENSITIVE));
        LANGUAGE_PATTERNS.put("typescript", Pattern.compile("(interface\\s+\\w+|type\\s+\\w+\\s*=|as\\s+\\w+|:\\s*\\w+\\[?\\]?)", Pattern.CASE_INSENSITIVE));
        LANGUAGE_PATTERNS.put("html", Pattern.compile("(<!DOCTYPE html>|<html>|<body>|<div>|<span>|<a href=)", Pattern.CASE_INSENSITIVE));
        LANGUAGE_PATTERNS.put("css", Pattern.compile("(body\\s*\\{|margin:|padding:|@media|#\\w+\\s*\\{|\\.\\w+\\s*\\{)", Pattern.CASE_INSENSITIVE));
        LANGUAGE_PATTERNS.put("sql", Pattern.compile("(SELECT\\s+.*?\\s+FROM|INSERT\\s+INTO|UPDATE\\s+.*?\\s+SET|DELETE\\s+FROM)", Pattern.CASE_INSENSITIVE));
        LANGUAGE_PATTERNS.put("c", Pattern.compile("(#include\\s*<|int\\s+main\\s*\\(|void\\s+\\w+\\s*\\(|printf\\s*\\()", Pattern.CASE_INSENSITIVE));
        LANGUAGE_PATTERNS.put("csharp", Pattern.compile("(using\\s+System;|namespace\\s+\\w+|public\\s+class)", Pattern.CASE_INSENSITIVE));
        LANGUAGE_PATTERNS.put("ruby", Pattern.compile("(def\\s+\\w+\\s*\\(|require\\s+\"\\w+\"|puts\\s+)", Pattern.CASE_INSENSITIVE));
        LANGUAGE_PATTERNS.put("go", Pattern.compile("(package\\s+\\w+|import\\s+\\(|func\\s+\\w+\\s*\\(|fmt\\.)", Pattern.CASE_INSENSITIVE));
        LANGUAGE_PATTERNS.put("rust", Pattern.compile("(fn\\s+\\w+\\s*\\(|let\\s+mut|pub\\s+struct|use\\s+\\w+::|impl)", Pattern.CASE_INSENSITIVE));
    }

    // Utility methods
    
    /**
     * Gets a preview of the content (first 100 characters)
     * @return A preview string of the snippet content
     */
    public String getContentPreview() {
        if (content == null || content.trim().isEmpty()) {
            return "(Empty snippet)";
        }
        
        String preview = content.substring(0, Math.min(100, content.length()));
        return content.length() > 100 ? preview + "..." : preview;
    }
    
    /**
     * Gets the line count of the content
     * @return Number of lines in the snippet
     */
    public int getLineCount() {
        if (content == null || content.isEmpty()) {
            return 0;
        }
        return content.split("\n").length;
    }
    
    /**
     * Detects the programming language from content if not explicitly set
     * @return Detected programming language or default
     */
    public String getDetectedLanguage() {
        if (language != null && !language.trim().isEmpty()) {
            return language;
        }
        
        if (content == null || content.trim().isEmpty()) {
            return "text";
        }
        
        // Advanced language detection using regex patterns
        for (Map.Entry<String, Pattern> entry : LANGUAGE_PATTERNS.entrySet()) {
            if (entry.getValue().matcher(content).find()) {
                return entry.getKey();
            }
        }
        
        // Simple fallback detection based on content patterns
        String contentLower = content.toLowerCase();
        
        // Basic language detection as fallback
        if (contentLower.contains("public class") || contentLower.contains("system.out.println")) {
            return "java";
        } else if (contentLower.contains("def ") || contentLower.contains("import ")) {
            return "python";
        } else if (contentLower.contains("function") || contentLower.contains("const ") || contentLower.contains("=>")) {
            return "javascript";
        } else if (contentLower.contains("#include") || contentLower.contains("printf")) {
            return "c";
        } else if (contentLower.contains("select ") || contentLower.contains("from ")) {
            return "sql";
        } else if (contentLower.contains("<html") || contentLower.contains("<div")) {
            return "html";
        } else if (contentLower.contains("@media") || contentLower.contains("margin:")) {
            return "css";
        }
        
        return "text";
    }
    
    /**
     * Formats the content for display, ensuring consistent line endings
     * @return Formatted content string
     */
    public String getFormattedContent() {
        if (content == null || content.isEmpty()) {
            return "";
        }
        
        // Normalize line endings to LF
        return content.replace("\r\n", "\n");
    }
    
    /**
     * Gets the note ID this snippet belongs to
     * @return The ID of the parent note
     */
    public Long getNoteId() {
        return note != null ? note.getId() : null;
    }

    // Getters and Setters
    
    public Long getId() { 
        return id; 
    }
    
    public void setId(Long id) { 
        this.id = id; 
    }
    
    public String getName() { 
        return name; 
    }
    
    public void setName(String name) { 
        this.name = name; 
    }
    
    public String getLanguage() { 
        return language; 
    }
    
    public void setLanguage(String language) { 
        this.language = language; 
    }
    
    public String getContent() { 
        return content; 
    }
    
    public void setContent(String content) { 
        this.content = content; 
    }
    
    public String getImageUrl() { 
        return imageUrl; 
    }
    
    public void setImageUrl(String imageUrl) { 
        this.imageUrl = imageUrl; 
    }
    
    public CodeNote getNote() { 
        return note; 
    }
    
    public void setNote(CodeNote note) { 
        this.note = note; 
    }
    
    public LocalDateTime getCreatedAt() { 
        return createdAt; 
    }
    
    public LocalDateTime getUpdatedAt() { 
        return updatedAt; 
    }

    @Override
    public String toString() {
        return "CodeSnippet{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", language='" + (language != null ? language : getDetectedLanguage()) + '\'' +
                ", lineCount=" + getLineCount() +
                ", noteId=" + getNoteId() +
                '}';
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        
        CodeSnippet snippet = (CodeSnippet) o;
        return id != null && id.equals(snippet.getId());
    }
    
    @Override
    public int hashCode() {
        return id != null ? id.hashCode() : 0;
    }
}

