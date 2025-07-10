# CodeBoard Frontend

A modern React-based web application for managing and organizing code snippets with a beautiful Material UI interface.

## Features

- 🎨 Modern Material UI design with light/dark theme support
- 📝 Create and manage code notes with syntax highlighting
- 🏷️ Tag-based organization
- 🔍 Advanced search capabilities
- 🎯 Intuitive code snippet management
- 📱 Fully responsive design
- 🔔 Toast notifications system
- ⚡ Fast and efficient React components

## Tech Stack

- React 18
- TypeScript
- Material UI (MUI)
- Vite
- React Router
- Code highlighting with Prism.js
- ESLint + Prettier

## Prerequisites

- Node.js 16.x or higher
- npm 8.x or higher

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/yourusername/codeboard-frontend.git
cd codeboard-frontend
```

2. Install dependencies:

```bash
npm install
```

3. Configure the backend API endpoint in `src/services/api/client.ts`:

```typescript
export const API_BASE_URL = "http://localhost:8080/api";
```

4. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Project Structure

```
src/
├── assets/          # Static assets
├── components/      # Reusable React components
│   └── ui/         # UI components
├── models/         # TypeScript interfaces and types
├── pages/          # Page components
├── services/       # API and other services
│   └── api/       # API modules
├── theme/          # Theme configuration
└── utils/          # Utility functions
```

## Features in Detail

### Components

- **CodeHighlighter**: Syntax highlighting for multiple programming languages
- **LoadingSpinner**: Customizable loading indicators
- **ToastProvider**: Toast notification system
- **EnhancedSettingsPanel**: Theme and application settings
- **ApiHealthCheck**: Backend connectivity status

### Pages

- **HomePage**: Dashboard with note listing and quick actions
- **CreateNotePage**: Create and edit notes
- **NoteDetailPage**: View and manage individual notes
- **FeatureDemoPage**: Showcase of UI components and features
- **AboutPage**: Application information

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
