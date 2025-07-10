package dev.tanishq.codeboard.model;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

/**
 * Enumeration of available tags for categorizing CodeNotes.
 * 
 * Each tag has:
 * - A display name for user interfaces
 * - An emoji for visual representation
 * - A description for documentation and UI tooltips
 * - Methods to retrieve formatted display strings
 * 
 * Tags help users organize and filter their code notes by category.
 */
public enum NoteTag {
    // Development Categories
    DATABASE("Database", "🗄️", "Data storage, queries, and database management"),
    ALGORITHM("Algorithm", "🧮", "Algorithms, data structures, and computational logic"),
    FRONTEND("Frontend", "🎨", "User interface, web design, and client-side development"),
    BACKEND("Backend", "⚙️", "Server-side logic, APIs, and system architecture"),
    
    // Learning and Documentation
    TUTORIAL("Tutorial", "📚", "Step-by-step guides and learning materials"),
    NOTES("Notes", "📋", "General notes, documentation, and reference materials"),
    SNIPPET("Snippet", "✂️", "Reusable code snippets and utilities"),
    
    // Project Types
    DIY("DIY", "🔨", "Do-it-yourself projects and custom solutions"),
    GAMES("Games", "🎮", "Game development and interactive applications"),
    COMPONENTS("Components", "🧩", "Reusable components and modules"),
    
    // Technologies
    MOBILE("Mobile", "📱", "Mobile app development and responsive design"),
    WEB("Web", "🌐", "Web development and online applications"),
    API("API", "🔌", "Application programming interfaces and integrations"),
    
    // Tools and Utilities
    TOOLS("Tools", "🛠️", "Development tools, scripts, and utilities"),
    CONFIG("Config", "⚙️", "Configuration files and setup instructions"),
    
    // General
    EXPERIMENTAL("Experimental", "🧪", "Experimental code and proof of concepts"),
    ARCHIVE("Archive", "📦", "Archived projects and deprecated code"),
    OTHER("Other", "🔖", "Miscellaneous notes that don't fit other categories");

    private final String displayName;
    private final String emoji;
    private final String description;

    NoteTag(String displayName, String emoji, String description) {
        this.displayName = displayName;
        this.emoji = emoji;
        this.description = description;
    }

    /**
     * Gets the human-readable display name
     * @return The display name of the tag
     */
    public String getDisplayName() {
        return displayName;
    }

    /**
     * Gets the emoji representation
     * @return The emoji character for this tag
     */
    public String getEmoji() {
        return emoji;
    }

    /**
     * Gets the description of what this tag represents
     * @return A description explaining the tag's purpose
     */
    public String getDescription() {
        return description;
    }

    /**
     * Gets the display name with emoji prefix
     * @return String with emoji followed by display name
     */
    public String getDisplayWithEmoji() {
        return emoji + " " + displayName;
    }
    
    /**
     * Gets the full display including description
     * @return Complete representation with emoji, name, and description
     */
    public String getFullDisplay() {
        return emoji + " " + displayName + " - " + description;
    }
    
    /**
     * Finds a tag by its display name (case-insensitive)
     * @param displayName The display name to search for
     * @return The matching tag or OTHER if not found
     */
    public static NoteTag findByDisplayName(String displayName) {
        if (displayName == null) return OTHER;
        
        return Arrays.stream(values())
                .filter(tag -> tag.displayName.equalsIgnoreCase(displayName))
                .findFirst()
                .orElse(OTHER);
    }
    
    /**
     * Finds a tag by its name (enum constant)
     * @param name The exact enum name to search for
     * @return Optional containing the tag if found
     */
    public static Optional<NoteTag> findByName(String name) {
        if (name == null || name.isEmpty()) {
            return Optional.empty();
        }
        
        try {
            return Optional.of(NoteTag.valueOf(name.toUpperCase()));
        } catch (IllegalArgumentException e) {
            return Optional.empty();
        }
    }
    
    /**
     * Gets all development-related tags
     * @return Array of tags related to development
     */
    public static NoteTag[] getDevelopmentTags() {
        return new NoteTag[]{DATABASE, ALGORITHM, FRONTEND, BACKEND, API, WEB, MOBILE};
    }
    
    /**
     * Gets all learning-related tags
     * @return Array of tags related to learning and documentation
     */
    public static NoteTag[] getLearningTags() {
        return new NoteTag[]{TUTORIAL, NOTES, SNIPPET};
    }
    
    /**
     * Gets all available tags as a list
     * @return List of all available tags
     */
    public static List<NoteTag> getAllTags() {
        return Arrays.asList(values());
    }
    
    /**
     * Checks if the given string is a valid tag name
     * @param name The name to check
     * @return true if it's a valid tag name, false otherwise
     */
    public static boolean isValidTagName(String name) {
        return findByName(name).isPresent();
    }
}
