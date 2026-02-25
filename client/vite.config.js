import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  logLevel: 'warn',
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
    host: true, // Expose to network if needed
    port: 5173, // Enforce port for consistency
  },
  plugins: [
    react(),
    {
      name: 'print-url',
      configureServer(server) {
        server.httpServer?.once('listening', () => {
          setTimeout(() => {
            console.log('\n  ➜  Local:   http://localhost:5173/\n');
          }, 100);
        });
      }
    }
  ],
})
