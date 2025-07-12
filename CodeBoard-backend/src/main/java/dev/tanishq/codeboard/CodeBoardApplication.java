package dev.tanishq.codeboard;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class CodeBoardApplication {
    public static void main(String[] args) {
        SpringApplication.run(CodeBoardApplication.class, args);
        System.out.println("CodeBoard running on http://localhost:8080");
    }
}
