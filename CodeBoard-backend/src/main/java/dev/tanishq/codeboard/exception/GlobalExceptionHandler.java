package dev.tanishq.codeboard.exception;

import jakarta.validation.ConstraintViolationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.nio.file.AccessDeniedException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Global exception handler for the CodeBoard application.
 * <p>
 * Centralized error handling for all controllers, providing standardized
 * error responses with appropriate HTTP status codes.
 * </p>
 * <p>
 * Extends {@link ResponseEntityExceptionHandler} to handle Spring MVC exceptions.
 * </p>
 */
@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    /**
     * Creates a standard error response structure
     */
    private Map<String, Object> createErrorResponse(HttpStatus status, String error, String message) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("timestamp", LocalDateTime.now().toString());
        errorResponse.put("status", status.value());
        errorResponse.put("error", error);
        errorResponse.put("message", message);
        return errorResponse;
    }

    /**
     * Handles ResourceNotFoundException
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleResourceNotFound(ResourceNotFoundException ex) {
        log.warn("Resource not found: {}", ex.getMessage());
        
        Map<String, Object> errorResponse = createErrorResponse(
                HttpStatus.NOT_FOUND, 
                "Resource Not Found", 
                ex.getMessage());
        
        // Add resource details if available
        if (ex.getResourceName() != null) {
            Map<String, Object> resourceDetails = new HashMap<>();
            resourceDetails.put("resourceName", ex.getResourceName());
            resourceDetails.put("fieldName", ex.getFieldName());
            resourceDetails.put("fieldValue", ex.getFieldValue());
            errorResponse.put("details", resourceDetails);
        }
        
        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }

    /**
     * Handles IllegalArgumentException
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalArgument(IllegalArgumentException ex) {
        log.warn("Illegal argument: {}", ex.getMessage());
        
        Map<String, Object> errorResponse = createErrorResponse(
                HttpStatus.BAD_REQUEST, 
                "Bad Request", 
                ex.getMessage());
        
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    /**
     * Handles ConstraintViolationException (for @Validated method parameters)
     */
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<Map<String, Object>> handleConstraintViolation(ConstraintViolationException ex) {
        log.warn("Validation error: {}", ex.getMessage());
        
        // Extract validation errors
        Map<String, String> validationErrors = ex.getConstraintViolations().stream()
                .collect(Collectors.toMap(
                        violation -> violation.getPropertyPath().toString(),
                        violation -> violation.getMessage(),
                        (error1, error2) -> error1 + "; " + error2));
        
        Map<String, Object> errorResponse = createErrorResponse(
                HttpStatus.BAD_REQUEST, 
                "Validation Failed", 
                "Input validation failed");
                
        errorResponse.put("validationErrors", validationErrors);
        
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    /**
     * Handles database access errors
     */
    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<Map<String, Object>> handleDataAccessException(DataAccessException ex) {
        log.error("Database error: {}", ex.getMessage(), ex);
        
        Map<String, Object> errorResponse = createErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR, 
                "Database Error", 
                "A database error occurred");
        
        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    /**
     * Handles database integrity violation errors
     */
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, Object>> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
        log.error("Data integrity violation: {}", ex.getMessage(), ex);
        
        String message = "Data integrity violation: The operation would violate data constraints";
        
        // Extract better message from the cause if possible
        if (ex.getRootCause() != null && ex.getRootCause().getMessage() != null) {
            String rootCauseMessage = ex.getRootCause().getMessage();
            if (rootCauseMessage.contains("foreign key") || rootCauseMessage.contains("FK")) {
                message = "Cannot delete or update: this record is referenced by other data";
            } else if (rootCauseMessage.contains("unique") || rootCauseMessage.contains("duplicate")) {
                message = "A record with this information already exists";
            }
        }
        
        Map<String, Object> errorResponse = createErrorResponse(
                HttpStatus.CONFLICT, 
                "Data Conflict", 
                message);
        
        return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
    }

    /**
     * Handles type mismatch errors in request parameters
     */
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<Map<String, Object>> handleMethodArgumentTypeMismatch(MethodArgumentTypeMismatchException ex) {
        log.warn("Type mismatch: {} for parameter {}", ex.getMessage(), ex.getName());
        
        String message = String.format("'%s' parameter should be a valid %s", 
                ex.getName(), 
                Optional.ofNullable(ex.getRequiredType())
                       .map(Class::getSimpleName)
                       .orElse("type"));
        
        Map<String, Object> errorResponse = createErrorResponse(
                HttpStatus.BAD_REQUEST, 
                "Type Mismatch", 
                message);
        
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    /**
     * Handles access denied exceptions
     */
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, Object>> handleAccessDenied(AccessDeniedException ex) {
        log.warn("Access denied: {}", ex.getMessage());
        
        Map<String, Object> errorResponse = createErrorResponse(
                HttpStatus.FORBIDDEN, 
                "Access Denied", 
                "You don't have permission to access this resource");
        
        return new ResponseEntity<>(errorResponse, HttpStatus.FORBIDDEN);
    }

    /**
     * Override to handle validation errors
     */
    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex, 
            HttpHeaders headers, 
            HttpStatusCode status, 
            WebRequest request) {
        
        log.warn("Validation error: {}", ex.getMessage());
        
        // Get all field errors
        List<FieldError> fieldErrors = ex.getBindingResult().getFieldErrors();
        
        // Map field errors to a more user-friendly format
        Map<String, String> validationErrors = fieldErrors.stream()
                .collect(Collectors.toMap(
                        FieldError::getField, 
                        error -> Optional.ofNullable(error.getDefaultMessage()).orElse("Invalid value"),
                        (error1, error2) -> error1 + "; " + error2));
        
        Map<String, Object> errorResponse = createErrorResponse(
                HttpStatus.BAD_REQUEST, 
                "Validation Failed", 
                "Input validation failed");
                
        errorResponse.put("validationErrors", validationErrors);
        
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    /**
     * Override to handle missing required parameters
     */
    @Override
    protected ResponseEntity<Object> handleMissingServletRequestParameter(
            MissingServletRequestParameterException ex, 
            HttpHeaders headers, 
            HttpStatusCode status, 
            WebRequest request) {
        
        log.warn("Missing parameter: {}", ex.getParameterName());
        
        Map<String, Object> errorResponse = createErrorResponse(
                HttpStatus.BAD_REQUEST, 
                "Missing Parameter", 
                "Required parameter '" + ex.getParameterName() + "' is missing");
        
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    /**
     * Override to handle request body parsing errors
     */
    @Override
    protected ResponseEntity<Object> handleHttpMessageNotReadable(
            HttpMessageNotReadableException ex, 
            HttpHeaders headers, 
            HttpStatusCode status, 
            WebRequest request) {
        
        log.warn("Message not readable: {}", ex.getMessage());
        
        Map<String, Object> errorResponse = createErrorResponse(
                HttpStatus.BAD_REQUEST, 
                "Invalid Request", 
                "The request body is invalid or malformed");
        
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    /**
     * Override to handle unsupported HTTP methods
     */
    @Override
    protected ResponseEntity<Object> handleHttpRequestMethodNotSupported(
            HttpRequestMethodNotSupportedException ex, 
            HttpHeaders headers, 
            HttpStatusCode status, 
            WebRequest request) {
        
        log.warn("Method not supported: {}", ex.getMethod());
        
        Map<String, Object> errorResponse = createErrorResponse(
                HttpStatus.METHOD_NOT_ALLOWED, 
                "Method Not Allowed", 
                "The " + ex.getMethod() + " method is not supported for this endpoint");
        
        if (ex.getSupportedHttpMethods() != null) {
            errorResponse.put("supportedMethods", ex.getSupportedHttpMethods());
        }
        
        return new ResponseEntity<>(errorResponse, HttpStatus.METHOD_NOT_ALLOWED);
    }

    /**
     * Override to handle media type not supported
     */
    @Override
    protected ResponseEntity<Object> handleHttpMediaTypeNotSupported(
            HttpMediaTypeNotSupportedException ex, 
            HttpHeaders headers, 
            HttpStatusCode status, 
            WebRequest request) {
        
        log.warn("Media type not supported: {}", ex.getContentType());
        
        Map<String, Object> errorResponse = createErrorResponse(
                HttpStatus.UNSUPPORTED_MEDIA_TYPE, 
                "Unsupported Media Type", 
                "The media type is not supported");
        
        if (ex.getSupportedMediaTypes() != null) {
            errorResponse.put("supportedMediaTypes", ex.getSupportedMediaTypes());
        }
        
        return new ResponseEntity<>(errorResponse, HttpStatus.UNSUPPORTED_MEDIA_TYPE);
    }

    /**
     * Override to handle 404 errors
     */
    @Override
    protected ResponseEntity<Object> handleNoHandlerFoundException(
            NoHandlerFoundException ex, 
            HttpHeaders headers, 
            HttpStatusCode status, 
            WebRequest request) {
        
        log.warn("No handler found: {} {}", ex.getHttpMethod(), ex.getRequestURL());
        
        Map<String, Object> errorResponse = createErrorResponse(
                HttpStatus.NOT_FOUND, 
                "Not Found", 
                "The requested resource does not exist");
                
        errorResponse.put("path", ex.getRequestURL());
        
        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }

    /**
     * Fallback handler for any unhandled exceptions
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGenericException(Exception ex) {
        log.error("Unhandled exception: {}", ex.getMessage(), ex);
        
        Map<String, Object> errorResponse = createErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR, 
                "Internal Server Error", 
                "An unexpected error occurred");
        
        // Add exception type for debugging (only in non-production environments)
        errorResponse.put("exceptionType", ex.getClass().getName());
        
        // Check for custom response status annotation
        ResponseStatus responseStatus = ex.getClass().getAnnotation(ResponseStatus.class);
        HttpStatus status = responseStatus != null ? responseStatus.value() : HttpStatus.INTERNAL_SERVER_ERROR;
        
        return new ResponseEntity<>(errorResponse, status);
    }
}
