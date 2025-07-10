# 📝 CodeBoard - Modern Code Note Management System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Java](https://img.shields.io/badge/Java-21-ED8B00?logo=openjdk&logoColor=white)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.5-6DB33F?logo=spring&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19.1-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

A comprehensive, modern web application for managing code notes, snippets, and documentation. Built with Spring Boot backend and React frontend, featuring a beautiful UI, powerful search capabilities, and robust code organization.

## ✨ Features

### 🎯 Core Functionality

- **📋 Note Management**: Create, edit, delete, and organize code notes
- **🔍 Advanced Search**: Full-text search across titles, descriptions, and content
- **🏷️ Smart Tagging**: Categorize notes with intuitive tag system
- **📝 Code Snippets**: Attach and manage multiple code snippets per note
- **🎨 Syntax Highlighting**: Automatic language detection and highlighting
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile

### 🚀 Advanced Features

- **⚡ Real-time Search**: Instant search results as you type
- **📊 Analytics**: Track note statistics and usage patterns
- **🔄 Auto-save**: Never lose your work with automatic saving
- **🌐 API-First**: RESTful API for integration with other tools
- **📈 Performance**: Optimized database queries and caching
- **🔒 Validation**: Comprehensive input validation and error handling

## 🏗️ Architecture

### Backend (Spring Boot)

```
📦 CodeBoard-backend/
├── 🗂️ src/main/java/dev/tanishq/codeboard/
│   ├── 📱 controller/          # REST API endpoints
│   ├── 🏛️ model/               # JPA entities
│   ├── 🗃️ repository/          # Data access layer
│   ├── ⚙️ service/             # Business logic
│   ├── 🔧 config/              # Configuration classes
│   └── ⚠️ exception/           # Exception handling
├── 🗂️ src/main/resources/
│   └── ⚙️ application.properties
└── 🔨 build.gradle
```

### Frontend (React + TypeScript)

```
📦 Codeboard-frontend/
├── 🗂️ src/
│   ├── 📱 components/          # Reusable UI components
│   ├── 📄 pages/               # Page components
│   ├── 🌐 services/            # API communication
│   ├── 🎨 theme/               # Design system
│   └── 🖼️ assets/              # Static assets
├── 📋 package.json
└── ⚙️ vite.config.ts
```

## 🚀 Quick Start

### Prerequisites

- **Java 21+** (OpenJDK recommended)
- **Node.js 18+** and npm
- **Git** for version control

### 1. Clone the Repository

```bash
git clone <repository-url>
cd CodeBoard
```

### 2. Start the Backend

```bash
cd CodeBoard-backend
./gradlew bootRun
```

The backend will start on `http://localhost:8080`

### 3. Start the Frontend

```bash
cd Codeboard-frontend
npm install
npm run dev
```

The frontend will start on `http://localhost:5173`

### 4. Access the Application

Open your browser and navigate to `http://localhost:5173`

## 🛠️ Development Setup

### Backend Development

```bash
# Run tests
./gradlew test

# Build application
./gradlew build

# Run with development profile
./gradlew bootRun --args='--spring.profiles.active=dev'

# Generate project info
./gradlew projectInfo
```

### Frontend Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Build for production
npm run build:prod
```

## 📚 API Documentation

### Notes Endpoints

| Method   | Endpoint                             | Description      |
| -------- | ------------------------------------ | ---------------- |
| `GET`    | `/api/codenotes`                     | Get all notes    |
| `GET`    | `/api/codenotes/{id}`                | Get note by ID   |
| `POST`   | `/api/codenotes`                     | Create new note  |
| `PUT`    | `/api/codenotes/{id}`                | Update note      |
| `DELETE` | `/api/codenotes/{id}`                | Delete note      |
| `GET`    | `/api/codenotes/search?q={query}`    | Search notes     |
| `GET`    | `/api/codenotes/by-tags?tags={tags}` | Filter by tags   |
| `GET`    | `/api/codenotes/recent?days={days}`  | Get recent notes |

### Tags Endpoints

| Method | Endpoint                          | Description            |
| ------ | --------------------------------- | ---------------------- |
| `GET`  | `/api/codenotes/tags`             | Get all available tags |
| `GET`  | `/api/codenotes/tags/development` | Get development tags   |
| `GET`  | `/api/codenotes/tags/learning`    | Get learning tags      |

### Snippets Endpoints

| Method   | Endpoint             | Description       |
| -------- | -------------------- | ----------------- |
| `GET`    | `/api/snippets`      | Get all snippets  |
| `GET`    | `/api/snippets/{id}` | Get snippet by ID |
| `POST`   | `/api/snippets`      | Create snippet    |
| `PUT`    | `/api/snippets/{id}` | Update snippet    |
| `DELETE` | `/api/snippets/{id}` | Delete snippet    |

## 🎨 Design System

### Color Palette

- **Primary**: `#2d5a87` - Deep blue for main UI elements
- **Secondary**: `#4a90a4` - Lighter blue for accents
- **Accent**: `#fba257` - Warm orange for highlights
- **Success**: `#10b981` - Green for success states
- **Error**: `#ef4444` - Red for error states

### Typography

- **Display**: Poppins (headings)
- **Body**: Inter (general text)
- **Code**: JetBrains Mono (code blocks)

### Components

All components follow a consistent design system with:

- Rounded corners (4px, 8px, 12px, 16px)
- Consistent spacing scale
- Smooth animations and transitions
- Accessible color contrasts

## 🔧 Configuration

### Backend Configuration

Key configuration options in `application.properties`:

```properties
# Database
spring.datasource.url=jdbc:sqlite:codeboard.db
spring.jpa.hibernate.ddl-auto=update

# Server
server.port=8080

# Logging
logging.level.dev.tanishq.codeboard=INFO
```

### Frontend Configuration

Environment variables:

- `VITE_API_BASE_URL`: Backend API URL (default: `http://localhost:8080`)

## 📊 Database Schema

### CodeNote Entity

```sql
CREATE TABLE code_notes (
    id BIGINT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description VARCHAR(1000),
    content TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### CodeSnippet Entity

```sql
CREATE TABLE code_snippets (
    id BIGINT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    language VARCHAR(50),
    content TEXT,
    image_url VARCHAR(500),
    code_note_id BIGINT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### Note Tags (Junction Table)

```sql
CREATE TABLE note_tags (
    note_id BIGINT,
    tag VARCHAR(50)
);
```

## 🧪 Testing

### Backend Tests

```bash
# Run all tests
./gradlew test

# Run specific test class
./gradlew test --tests CodeNoteServiceTest

# Generate test report
./gradlew test jacocoTestReport
```

### Frontend Tests

```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 📈 Performance Optimization

### Backend Optimizations

- **Database Indexing**: Indexes on frequently queried fields
- **Lazy Loading**: Efficient JPA relationships
- **Query Optimization**: Custom queries for complex searches
- **Caching**: Application-level caching for static data

### Frontend Optimizations

- **Code Splitting**: Dynamic imports for route-based splitting
- **Image Optimization**: Lazy loading and proper sizing
- **Bundle Analysis**: Webpack bundle analyzer for size optimization
- **Service Workers**: Caching for offline functionality

## 🔐 Security Considerations

### Backend Security

- **Input Validation**: Comprehensive validation using Bean Validation
- **SQL Injection Prevention**: JPA/Hibernate parameterized queries
- **CORS Configuration**: Proper CORS setup for frontend communication
- **Error Handling**: Secure error messages without sensitive data exposure

### Frontend Security

- **XSS Prevention**: Proper data sanitization
- **API Security**: Secure API communication
- **Content Security Policy**: CSP headers for additional security

## 🚀 Deployment

### Backend Deployment

```bash
# Build JAR file
./gradlew build

# Run JAR file
java -jar build/libs/codeboard-backend-1.0.0.jar

# Docker deployment (create Dockerfile)
docker build -t codeboard-backend .
docker run -p 8080:8080 codeboard-backend
```

### Frontend Deployment

```bash
# Build for production
npm run build

# Serve static files
npm run preview

# Deploy to static hosting (Netlify, Vercel, etc.)
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style Guidelines

- **Backend**: Follow Google Java Style Guide
- **Frontend**: Use Prettier and ESLint configurations
- **Commits**: Use conventional commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Spring Boot** for the robust backend framework
- **React** for the dynamic frontend library
- **Material-UI** for beautiful UI components
- **Highlight.js** for syntax highlighting
- **SQLite** for the lightweight database solution

## 📞 Support

If you have any questions or need help:

1. Check the [Issues](../../issues) page for existing solutions
2. Create a new issue with detailed information
3. Join our community discussions

---

Made with ❤️ by [Tanishq](https://github.com/tanishq)

**Happy Coding! 🚀**
