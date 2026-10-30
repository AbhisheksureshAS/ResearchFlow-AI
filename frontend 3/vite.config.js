import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Dev proxy: the browser calls /api/* and Vite forwards it to FastAPI,
// so no CORS changes are needed on the backend during development.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: env.BACKEND_URL || 'http://localhost:8000',
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/api/, ''),
          timeout: 0,
          proxyTimeout: 0, // LLM agents can take minutes
        },
      },
    },
  }
})
