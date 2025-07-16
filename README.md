# CodeBoard - Clean & Simple Code Notes

A clean, simplified code note management system with automatic language detection and smart tagging.

## 🌐 Live Demo

**Try it now:** [https://tanishqtiwari7.github.io/CodeBoard/](https://tanishqtiwari7.github.io/CodeBoard/)

**GitHub Repository:** [https://github.com/tanishqtiwari7/CodeBoard](https://github.com/tanishqtiwari7/CodeBoard)

_Your notes are stored in your browser's localStorage - completely private and secure!_

## 🚀 Quick Start (Recommended)

**Frontend-Only Mode** - No backend needed:

```bash
cd Codeboard-frontend
npm install
npm run dev
```

Your notes are stored in browser localStorage. That's it!

## 🛠️ Optional Backend Mode

If you want a server:

1. **Start the backend:**

   ```bash
   # Windows
   start-backend.bat

   # Linux/Mac
   ./start-backend.sh
   ```

2. **Switch to backend mode:**

   ```typescript
   // In Codeboard-frontend/src/services/apiConfig.ts
   export const USE_LOCAL_STORAGE = false;
   ```

3. **Start the frontend:**
   ```bash
   cd Codeboard-frontend
   npm run dev
   ```

## ✨ Features

- 📝 **Code Management** - Create, edit, organize code snippets
- 🔍 **Smart Search** - Find code instantly by title, content, or tags
- 🏷️ **10 Smart Tags** - Predefined tags for easy organization
- 🌈 **Auto Language Detection** - Powered by highlight.js
- 💾 **Dual Storage** - localStorage or backend database
- 🎨 **Modern UI** - Clean Material-UI interface
- ⚡ **Zero Setup** - Works instantly without configuration

## 🏷️ Available Tags

- 🧮 Algorithm - 🔗 API - 🖥️ Frontend - ⚙️ Backend - 💾 Database
- 🔧 Utility - 🧪 Testing - ⚙️ Config - 💡 Example - ⭐ Important

## 📁 Project Structure

```
CodeBoard/
├── CodeBoard-backend/          # Clean Spring Boot backend (4 files)
│   ├── src/main/java/
│   │   └── dev/tanishq/codeboard/
│   │       ├── CodeBoardApplication.java
│   │       ├── controller/CodeNoteController.java
│   │       ├── model/CodeNote.java
│   │       └── repository/CodeNoteRepository.java
│   └── build.gradle            # Minimal dependencies
├── Codeboard-frontend/         # React frontend (clean & organized)
│   ├── src/
│   │   ├── components/         # Essential components + tag selector
│   │   ├── pages/              # 5 pages (all original functionality)
│   │   ├── services/           # 1 unified API file
│   │   ├── constants/          # 10 predefined tags
│   │   └── utils/              # Language detection with highlight.js
│   └── package.json
├── start-backend.bat           # Start backend (Windows)
├── start-backend.sh            # Start backend (Linux/Mac)
└── README.md                   # This file
```

## 🔧 Tech Stack

**Frontend**: React 18, TypeScript, Material-UI, Highlight.js, Vite  
**Backend**: Spring Boot 3, Java 21, H2 Database, JPA

## 🎯 What Makes This Clean

✅ **Minimal files** - Only essential code  
✅ **No complex setup** - Works instantly  
✅ **Same great UI** - All original features preserved  
✅ **Smart defaults** - Automatic language detection  
✅ **Easy switching** - One line config change  
✅ **Modern stack** - Latest versions of everything  
✅ **Clean naming** - No confusing file names  
✅ **No duplicates** - Single source of truth

## 💡 Usage Tips

1. **Language Detection**: Automatic - just paste your code
2. **Tags**: Click tags in the horizontal selector to organize
3. **Search**: Real-time search across all content
4. **Modes**: Switch anytime by changing one line in config

---

**Ready to organize your code? Choose your mode and start coding! 🚀**
