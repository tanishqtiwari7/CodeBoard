package dev.tanishq.codeboard.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;
import java.util.List;

/**
 * Configuration class for Cross-Origin Resource Sharing (CORS) settings.
 * Allows controlled access to resources from different domains.
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Value("${codeboard.cors.allowed-origins:http://localhost:3000,http://localhost:5173,http://localhost:4173}")
    private List<String> allowedOrigins;
    
    @Value("${codeboard.cors.allowed-methods:GET,POST,PUT,PATCH,DELETE,OPTIONS}")
    private List<String> allowedMethods;
    
    @Value("${codeboard.cors.max-age:3600}")
    private long maxAge;
    
    @Value("${codeboard.cors.allow-credentials:true}")
    private boolean allowCredentials;

    private final Environment environment;

    public CorsConfig(Environment environment) {
        this.environment = environment;
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Apply to all endpoints
        if (isDevelopment()) {
            registry.addMapping("/**")
                .allowedOrigins(
                    "http://localhost:3000",
                    "http://localhost:5173",
                    "http://localhost:5174",
                    "http://localhost:4173",
                    "http://127.0.0.1:3000",
                    "http://127.0.0.1:5173",
                    "http://127.0.0.1:5174",
                    "http://127.0.0.1:4173"
                )
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .exposedHeaders("Access-Control-Allow-Origin", "Access-Control-Allow-Credentials")
                .allowCredentials(allowCredentials)
                .maxAge(maxAge);
        } else {
            registry.addMapping("/**")
                .allowedOrigins(allowedOrigins.toArray(new String[0]))
                .allowedMethods(allowedMethods.toArray(new String[0]))
                .allowedHeaders("*")
                .exposedHeaders("Access-Control-Allow-Origin", "Access-Control-Allow-Credentials")
                .allowCredentials(allowCredentials)
                .maxAge(maxAge);
        }
    }
    
    /**
     * Provides a CORS configuration source for Spring Security.
     * This is required when using Spring Security with CORS.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // If in development mode, allow more origins
        if (isDevelopment()) {
            configuration.setAllowedOrigins(Arrays.asList(
                "http://localhost:3000",
                "http://localhost:5173",
                "http://localhost:5174",
                "http://localhost:4173",
                "http://127.0.0.1:3000",
                "http://127.0.0.1:5173",
                "http://127.0.0.1:5174",
                "http://127.0.0.1:4173"
            ));
        } else {
            configuration.setAllowedOrigins(allowedOrigins);
        }
        
        configuration.setAllowedMethods(allowedMethods);
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setExposedHeaders(List.of("Access-Control-Allow-Origin", "Access-Control-Allow-Credentials"));
        configuration.setAllowCredentials(allowCredentials);
        configuration.setMaxAge(maxAge);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
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
