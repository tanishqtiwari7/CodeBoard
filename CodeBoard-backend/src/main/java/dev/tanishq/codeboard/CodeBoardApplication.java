package dev.tanishq.codeboard;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.env.Environment;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.net.InetAddress;
import java.net.UnknownHostException;

/**
 * Main application class for CodeBoard - A comprehensive code note management system.
 * 
 * Features:
 * - Create, read, update, and delete code notes
 * - Categorize notes with tags
 * - Store code snippets with syntax highlighting support
 * - Full-text search capabilities
 * - RESTful API for frontend integration
 * 
 * @author Tanishq
 * @version 1.0.0
 */
@SpringBootApplication
@EnableJpaAuditing
@RequiredArgsConstructor
public class CodeBoardApplication {
    
    private static final Logger logger = LoggerFactory.getLogger(CodeBoardApplication.class);
    
    private final Environment env;
    
    public static void main(String[] args) {
        SpringApplication.run(CodeBoardApplication.class, args);
    }
    
    /**
     * Event listener to log application startup completion with detailed access information
     */
    @EventListener(ApplicationReadyEvent.class)
    public void onApplicationReady() {
        String protocol = "http";
        String serverPort = env.getProperty("server.port", "8080");
        String contextPath = env.getProperty("server.servlet.context-path", "/");
        String hostAddress = "localhost";
        
        try {
            hostAddress = InetAddress.getLocalHost().getHostAddress();
        } catch (UnknownHostException e) {
            logger.warn("The host name could not be determined, using 'localhost' as fallback");
        }
        
        logger.info("""
            
            ----------------------------------------------------------
            🚀 CodeBoard Application is running!
            
            📝 Access URLs:
            🌐 Local:     {}://localhost:{}{}
            🔄 External:  {}://{}:{}{}
            📊 API Docs:  {}://localhost:{}{}/swagger-ui/index.html
            🔎 API Root:  {}://localhost:{}{}/api/
            
            ----------------------------------------------------------
            """, 
            protocol, serverPort, contextPath,
            protocol, hostAddress, serverPort, contextPath,
            protocol, serverPort, contextPath,
            protocol, serverPort, contextPath);
            
        // Console output for visibility
        System.out.println("\n🚀 CodeBoard Application is ready!");
        System.out.println("📝 API available at: http://localhost:" + serverPort + "/api/");
        System.out.println("🎯 Frontend should connect to: http://localhost:" + serverPort);
    }
}

