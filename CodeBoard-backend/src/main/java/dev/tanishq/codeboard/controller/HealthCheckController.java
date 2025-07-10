package dev.tanishq.codeboard.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Controller providing health check and status endpoints
 */
@RestController
@RequestMapping("/api")
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
public class HealthCheckController {
    
    /**
     * Health check endpoint
     * @return System status information
     */
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("timestamp", LocalDateTime.now().toString());
        response.put("message", "API is operational");
        response.put("version", "2.0");
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Health check endpoint (alternative URL)
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> alternativeHealthCheck() {
        return healthCheck();
    }
}
