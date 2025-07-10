# CodeBoard Development Guide

## Quick Start

### Backend (Java Spring Boot)

1. Open the project in IntelliJ IDEA
2. Navigate to `CodeBoard-backend/src/main/java/dev/tanishq/codeboard/CodeBoardApplication.java`
3. Right-click and select "Run CodeBoardApplication"
4. Wait for the message: "🚀 CodeBoard Application is ready!"
5. Backend will be available at: http://localhost:8080

### Frontend (React + TypeScript)

1. Open terminal in `Codeboard-frontend` directory
2. Run: `npm install` (if not already done)
3. Run: `npm run dev`
4. Frontend will be available at: http://localhost:5173

## New Features & Components

### 🎉 Enhanced Components

1. **Toast Notifications** (`/src/components/ToastProvider.tsx`)

   - Beautiful non-intrusive notifications
   - Multiple types: success, error, warning, info
   - Customizable duration and actions
   - Usage: `const { showToast } = useToast();`

2. **Loading Spinner** (`/src/components/LoadingSpinner.tsx`)

   - Smooth animations with customizable sizes
   - Full-page overlay option
   - Custom messages and colors

3. **Error Boundary** (`/src/components/ErrorBoundary.tsx`)

   - Catches JavaScript errors gracefully
   - Beautiful fallback UI
   - Recovery options for users
   - Development error details

4. **Advanced Search** (`/src/components/AdvancedSearch.tsx`)

   - Real-time search with filters
   - Tag-based filtering
   - Date range selection
   - Search history
   - Multiple sorting options

5. **Enhanced Settings Panel** (`/src/components/EnhancedSettingsPanel.tsx`)

   - Theme customization
   - Font size preferences
   - Data export/import
   - Application settings

6. **Quick Actions** (`/src/components/QuickActions.tsx`)
   - Floating action button
   - Quick access to common actions
   - Material-UI SpeedDial integration

### 🔧 Backend Improvements

1. **Enhanced Models**

   - Added audit fields (createdAt, updatedAt)
   - Better validation with constraints
   - Improved entity relationships
   - Utility methods for common operations

2. **Repository Layer**

   - Custom search queries
   - Full-text search capabilities
   - Date range filtering
   - Tag-based queries
   - Statistics and analytics

3. **Service Layer** (Auto-generated if using)

   - Business logic separation
   - Transaction management
   - Exception handling
   - Validation rules

4. **Enhanced Controllers**
   - Better error handling
   - Comprehensive API endpoints
   - Pagination support
   - Statistics endpoints

### 📱 New Pages

1. **Feature Demo Page** (`/demo`)
   - Interactive component demonstrations
   - Code examples in multiple languages
   - Feature showcase
   - Testing playground

### 🎨 UI/UX Improvements

1. **Better Visual Design**

   - Improved color scheme
   - Enhanced typography
   - Smooth animations
   - Responsive layout

2. **Enhanced Navigation**

   - Active state indicators
   - Mobile-friendly design
   - Quick actions access

3. **Improved User Feedback**
   - Toast notifications for actions
   - Loading states
   - Error recovery options
   - Success confirmations

## API Endpoints

### Notes

- `GET /api/codenotes` - Get all notes (with pagination)
- `GET /api/codenotes/{id}` - Get specific note
- `POST /api/codenotes` - Create new note
- `PUT /api/codenotes/{id}` - Update note
- `DELETE /api/codenotes/{id}` - Delete note
- `GET /api/codenotes/tags` - Get available tags
- `GET /api/codenotes/stats` - Get note statistics

### Code Snippets

- `GET /api/snippets/{id}` - Get specific snippet
- `POST /api/snippets` - Create new snippet
- `PUT /api/snippets/{id}` - Update snippet
- `DELETE /api/snippets/{id}` - Delete snippet
- `GET /api/snippets/search/content?q={query}` - Search snippets

### Health & Info

- `GET /actuator/health` - API health check
- `GET /actuator/info` - Application information

## Development Tips

### Frontend Development

1. Use TypeScript interfaces for type safety
2. Implement error boundaries for robust error handling
3. Use toast notifications for user feedback
4. Add loading states for better UX
5. Test components with the demo page

### Backend Development

1. Use proper validation annotations
2. Implement comprehensive error handling
3. Add logging for debugging
4. Use transactions for data consistency
5. Write unit tests for business logic

### Database

- SQLite database: `codeboard.db`
- Automatic schema updates with Hibernate
- Audit fields tracked automatically
- Full-text search supported

## Testing the Application

1. **Start Backend**: Run from IntelliJ
2. **Start Frontend**: `npm run dev`
3. **Test Basic Features**:
   - Create a new note
   - Edit existing notes
   - Delete notes
   - Search functionality
4. **Test Enhanced Features**:
   - Visit `/demo` page
   - Try toast notifications
   - Test error handling
   - Use advanced search
   - Open settings panel

## Troubleshooting

### Common Issues

1. **Backend not starting**: Check port 8080 is available
2. **Frontend API errors**: Ensure backend is running on localhost:8080
3. **Database issues**: Check SQLite file permissions
4. **Build errors**: Run `npm install` to update dependencies

### Error Messages

- "Failed to fetch notes": Backend not running or wrong port
- "CORS errors": Check CORS configuration in backend
- "Build errors": Check TypeScript types and imports

## Next Steps

1. Add user authentication
2. Implement real-time collaboration
3. Add file upload capabilities
4. Create mobile app version
5. Add syntax highlighting themes
6. Implement note sharing
7. Add export to various formats
8. Create backup/restore functionality

## Contributing

1. Follow TypeScript best practices
2. Add comments for complex logic
3. Use consistent naming conventions
4. Test new features thoroughly
5. Update documentation for changes
