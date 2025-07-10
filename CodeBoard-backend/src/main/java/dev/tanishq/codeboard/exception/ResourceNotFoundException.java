package dev.tanishq.codeboard.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Exception thrown when a requested resource is not found.
 * <p>
 * This is a runtime exception used throughout the application
 * to indicate that a requested entity (note, snippet, etc.) 
 * does not exist in the database.
 * </p>
 * <p>
 * Annotated with {@link ResponseStatus} to automatically return 404 Not Found
 * when this exception is thrown and not explicitly caught.
 * </p>
 */
@ResponseStatus(HttpStatus.NOT_FOUND)
public class ResourceNotFoundException extends RuntimeException {
    
    private static final long serialVersionUID = 1L;
    
    private final String resourceName;
    private final String fieldName;
    private final Object fieldValue;

    /**
     * Constructs a new ResourceNotFoundException with a simple message
     * 
     * @param message The exception message
     */
    public ResourceNotFoundException(String message) {
        super(message);
        this.resourceName = null;
        this.fieldName = null;
        this.fieldValue = null;
    }
    
    /**
     * Constructs a new ResourceNotFoundException with a message and cause
     * 
     * @param message The exception message
     * @param cause The cause of the exception
     */
    public ResourceNotFoundException(String message, Throwable cause) {
        super(message, cause);
        this.resourceName = null;
        this.fieldName = null;
        this.fieldValue = null;
    }
    
    /**
     * Constructs a new ResourceNotFoundException with detailed resource information
     * 
     * @param resourceName The name of the resource (e.g., "CodeNote", "CodeSnippet")
     * @param fieldName The name of the identifier field (e.g., "id", "name")
     * @param fieldValue The value of the identifier field
     */
    public ResourceNotFoundException(String resourceName, String fieldName, Object fieldValue) {
        super(String.format("%s not found with %s: %s", resourceName, fieldName, fieldValue));
        this.resourceName = resourceName;
        this.fieldName = fieldName;
        this.fieldValue = fieldValue;
    }

    /**
     * @return The name of the resource that wasn't found
     */
    public String getResourceName() {
        return resourceName;
    }

    /**
     * @return The name of the field used in the lookup
     */
    public String getFieldName() {
        return fieldName;
    }

    /**
     * @return The value of the field used in the lookup
     */
    public Object getFieldValue() {
        return fieldValue;
    }
}
