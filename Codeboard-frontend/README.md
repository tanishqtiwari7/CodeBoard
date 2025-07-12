# CodeBoard Frontend

A clean, simplified React application for managing code snippets with horizontal tag selection and automatic language detection.

## Features

- 🎨 Clean Material UI design with light/dark theme support
- 📝 Create and manage code notes with syntax highlighting
- 🏷️ Horizontal tag selector with 10 predefined tags
- 🔍 Real-time search across all content
- � Automatic language detection with highlight.js
- 📱 Fully responsive design
- 🔔 Toast notifications system
- 💾 Dual storage modes (localStorage or backend)

## Tech Stack

- React 18
- TypeScript
- Material UI (MUI)
- Vite
- React Router
- Highlight.js (for language detection)
- ESLint

## Prerequisites

- Node.js 16.x or higher
- npm 8.x or higher

## Getting Started

1. **Install dependencies:**

```bash
npm install
```

2. **Start the development server:**

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

**Note:** This runs in localStorage mode by default. To use backend mode, see the main project README.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Project Structure

```
src/
├── components/         # React components
│   ├── HorizontalTagSelector.tsx    # Tag selection component
│   ├── Navbar.tsx                   # Navigation bar
│   ├── ThemeProvider.tsx           # Theme management
│   └── ToastProvider.tsx           # Toast notifications
├── constants/          # App constants
│   └── tags.ts        # 10 predefined tags
├── pages/             # Page components
│   ├── HomePage.tsx           # Main dashboard
│   ├── CreateNotePage.tsx     # Create/edit notes
│   ├── NoteDetailPage.tsx     # Note details
│   ├── FeatureDemoPage.tsx    # Feature showcase
│   └── AboutPage.tsx          # About page
├── services/          # API and services
│   └── codeboardApi.ts       # Unified API (localStorage + backend)
└── utils/             # Utility functions
    └── highlightLanguageDetector.ts  # Language detection
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
