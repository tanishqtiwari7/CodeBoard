# CodeBoard Backend

A robust Spring Boot backend service for the CodeBoard application, providing API endpoints for managing code snippets, notes, and tags.

## Features

- RESTful API endpoints for code notes and snippets
- PostgreSQL database integration
- CORS configuration for frontend integration
- Efficient data pagination
- Tag-based organization
- Automatic language detection for code snippets

## Tech Stack

- Java 17
- Spring Boot 3.x
- Spring Data JPA
- PostgreSQL
- Gradle
- JUnit 5 for testing

## Prerequisites

- Java 17 or higher
- PostgreSQL 12 or higher
- Gradle 7.x or higher

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/yourusername/codeboard-backend.git
cd codeboard-backend
```

2. Configure your database in `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/codeboard
spring.datasource.username=your_username
spring.datasource.password=your_password
```

3. Build the project:

```bash
./gradlew build
```

4. Run the application:

```bash
./gradlew bootRun
```

The server will start on `http://localhost:8080`.

## API Endpoints

### Code Notes

- `GET /api/codenotes` - Get all notes (paginated)
- `GET /api/codenotes/{id}` - Get a specific note
- `POST /api/codenotes` - Create a new note
- `PUT /api/codenotes/{id}` - Update a note
- `DELETE /api/codenotes/{id}` - Delete a note
- `GET /api/codenotes/tags` - Get all available tags

### Code Snippets

- `GET /api/snippets` - Get all snippets
- `GET /api/snippets/{id}` - Get a specific snippet
- `POST /api/snippets` - Create a new snippet
- `PUT /api/snippets/{id}` - Update a snippet
- `DELETE /api/snippets/{id}` - Delete a snippet

## Development

### Project Structure

```
src/
├── main/
│   ├── java/
│   │   └── dev/
│   │       └── tanishq/
│   │           └── codeboard/
│   │               ├── controller/
│   │               ├── model/
│   │               ├── repository/
│   │               └── service/
│   └── resources/
│       └── application.properties
└── test/
    └── java/
        └── dev/
            └── tanishq/
                └── codeboard/
```

### Running Tests

```bash
./gradlew test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
