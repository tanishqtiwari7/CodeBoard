# CodeBoard Backend

A clean and minimal Spring Boot backend for the CodeBoard application.

## 🚀 Quick Start

```bash
# Windows
gradlew.bat bootRun

# Linux/Mac
./gradlew bootRun
```

The backend will start on `http://localhost:8080`

## 📁 Project Structure

```
CodeBoard-backend/
├── src/main/java/dev/tanishq/codeboard/
│   ├── CodeBoardApplication.java      # Main Spring Boot application
│   ├── controller/
│   │   └── CodeNoteController.java    # REST API endpoints
│   ├── model/
│   │   ├── CodeNote.java              # Note entity
│   │   └── NoteTag.java               # Tag entity
│   └── repository/
│       └── CodeNoteRepository.java    # Data access layer
├── src/main/resources/
│   └── application.properties         # Configuration
├── build.gradle                       # Dependencies
└── README.md                          # This file
```

## 🔧 Technology Stack

- **Java 21** - Modern Java version
- **Spring Boot 3.2.5** - Framework
- **Spring Data JPA** - Database abstraction
- **H2 Database** - In-memory database
- **Gradle** - Build tool

## 📡 API Endpoints

### Notes

- `GET /api/notes` - Get all notes
- `GET /api/notes/{id}` - Get note by ID
- `POST /api/notes` - Create new note
- `PUT /api/notes/{id}` - Update note
- `DELETE /api/notes/{id}` - Delete note

### Search

- `GET /api/notes/search?query={query}` - Search notes by title or content

### Statistics

- `GET /api/notes/stats` - Get notes statistics

## 🗄️ Database

Uses H2 in-memory database for simplicity:

- **Console**: `http://localhost:8080/h2-console`
- **JDBC URL**: `jdbc:h2:mem:codeboard`
- **Username**: `sa`
- **Password**: _(empty)_

## 🛠️ Configuration

Edit `src/main/resources/application.properties`:

```properties
# Server configuration
server.port=8080

# Database configuration
spring.datasource.url=jdbc:h2:mem:codeboard
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

# JPA configuration
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=true

# H2 Console (for development)
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console
```

## 🔒 CORS Configuration

CORS is enabled for frontend development:

- Allows origins: `http://localhost:3000`, `http://localhost:5173`
- Allows all HTTP methods
- Allows all headers

## 🏗️ Building

```bash
# Build the project
./gradlew build

# Run tests
./gradlew test

# Create executable JAR
./gradlew bootJar
```

## 🚀 Deployment

```bash
# Build JAR
./gradlew bootJar

# Run JAR
java -jar build/libs/CodeBoard-backend-0.0.1-SNAPSHOT.jar
```

## 📝 Features

- **CRUD Operations** - Full create, read, update, delete for notes
- **Search** - Text search across note titles and content
- **Tags** - Support for multiple tags per note
- **Statistics** - Basic stats like note count, tag usage
- **View Tracking** - Increment view count when notes are accessed
- **Auto-timestamps** - Created and updated timestamps
- **Data Validation** - Basic validation for required fields

## 🔄 Data Models

### CodeNote

```java
{
  "id": 1,
  "title": "Example Note",
  "content": "Code content here...",
  "language": "javascript",
  "tags": ["frontend", "api"],
  "viewCount": 5,
  "createdAt": "2025-01-01T10:00:00",
  "updatedAt": "2025-01-01T11:00:00"
}
```

### NoteTag

```java
{
  "name": "frontend",
  "color": "#3498db",
  "emoji": "🖥️"
}
```

## 🎯 Design Principles

- **Minimal** - Only essential features
- **Clean** - Simple, readable code
- **Stateless** - RESTful API design
- **Fast** - In-memory database for speed
- **Flexible** - Easy to extend or modify

## 💡 Development Tips

1. **Hot Reload**: Use Spring Boot DevTools for automatic restarts
2. **Database Inspection**: Use H2 Console to view data
3. **API Testing**: Use curl, Postman, or browser for testing
4. **Logging**: Check console for SQL queries and errors
5. **Frontend Integration**: Ensure CORS settings match frontend URL

---

**Simple, fast, and effective backend for your code notes! 🚀**
