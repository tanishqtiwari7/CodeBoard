package dev.tanishq.codeboard.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Value("${server.port}")
    private String serverPort;

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .components(new Components())
                .info(new Info()
                        .title("CodeBoard API")
                        .description("REST API for CodeBoard - A comprehensive code note management system")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("CodeBoard Team")
                                .email("info@codeboard.dev")
                                .url("https://codeboard.dev"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")))
                .servers(List.of(
                        new Server().url("http://localhost:" + serverPort)
                                .description("Development Server"),
                        new Server().url("https://api.codeboard.dev")
                                .description("Production Server")
                ));
    }
}
