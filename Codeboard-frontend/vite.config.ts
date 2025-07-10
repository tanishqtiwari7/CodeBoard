import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src"
    }
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      // Proxy API requests to backend server
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  // Define environment variables
  define: {
    "import.meta.env.APP_VERSION": JSON.stringify("2.0.0"),
    "import.meta.env.APP_MODE": JSON.stringify(mode)
  },
  // Enable source maps in production
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor code into separate chunks for better caching
          vendor: [
            'react', 
            'react-dom', 
            'react-router-dom',
            '@mui/material',
            '@mui/icons-material',
            '@emotion/react',
            '@emotion/styled'
          ],
          highlight: ['highlight.js', 'react-syntax-highlighter'],
          utils: ['date-fns', 'lodash', 'zod']
        }
      }
    }
  },
  // Testing configuration
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/'
      ]
    }
  }
}));
