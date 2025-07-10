package dev.tanishq.codeboard.config;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/**
 * CORS Filter to ensure all responses include proper CORS headers
 * This helps prevent browser security issues when frontend and backend 
 * are on different origins/ports.
 * 
 * Implementation based on OncePerRequestFilter to ensure it is only applied once per request.
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class CorsFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(CorsFilter.class);
    
    @Value("${codeboard.cors.allowed-origins:http://localhost:3000,http://localhost:5173,http://localhost:4173}")
    private List<String> allowedOrigins;
    
    @Value("${codeboard.cors.allowed-methods:GET,POST,PUT,DELETE,OPTIONS,PATCH}")
    private List<String> allowedMethods;
    
    @Value("${codeboard.cors.max-age:3600}")
    private long maxAge;
    
    @Value("${codeboard.cors.allow-credentials:true}")
    private boolean allowCredentials;
    
    private final Environment environment;

    public CorsFilter(Environment environment) {
        this.environment = environment;
    }
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        // Get the origin from the request
        String origin = request.getHeader("Origin");
        
        // Determine the list of origins to allow
        List<String> effectiveAllowedOrigins = isDevelopment() ? 
            Arrays.asList(
                "http://localhost:3000",
                "http://localhost:5173",
                "http://localhost:5174",
                "http://localhost:4173",
                "http://127.0.0.1:3000",
                "http://127.0.0.1:5173",
                "http://127.0.0.1:5174",
                "http://127.0.0.1:4173"
            ) : allowedOrigins;
            
        // Check if the origin is allowed
        if (origin != null && effectiveAllowedOrigins.contains(origin)) {
            response.setHeader("Access-Control-Allow-Origin", origin);
        } else {
            // For preflight requests in development mode, allow all origins
            if (isDevelopment() && "OPTIONS".equalsIgnoreCase(request.getMethod())) {
                response.setHeader("Access-Control-Allow-Origin", origin != null ? origin : "*");
            }
        }
        
        // Set other CORS headers
        response.setHeader("Access-Control-Allow-Methods", 
                allowedMethods.stream().collect(Collectors.joining(", ")));
        response.setHeader("Access-Control-Allow-Headers", 
                "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        response.setHeader("Access-Control-Max-Age", String.valueOf(maxAge));
        response.setHeader("Access-Control-Allow-Credentials", String.valueOf(allowCredentials));
        
        // For preflight requests, return 200 OK
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            logger.debug("Handling OPTIONS preflight request from origin: {}", origin);
            response.setStatus(HttpServletResponse.SC_OK);
            return;
        }
        
        // Continue with the filter chain
        filterChain.doFilter(request, response);
    }
    
    /**
     * Determines if the application is running in development mode
     * @return true if running in development profile
     */
    private boolean isDevelopment() {
        return Arrays.asList(environment.getActiveProfiles()).contains("dev") ||
               Arrays.asList(environment.getActiveProfiles()).contains("development") ||
               Arrays.asList(environment.getDefaultProfiles()).contains("default");
    }
}
