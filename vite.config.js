import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Proxy /api/* to vercel dev (runs on :3000) when using `npm run dev` (Vite only).
    // If you run `npm run dev:serverless` (vercel dev), this proxy is NOT needed —
    // vercel dev serves both Vite and /api functions on the same port.
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
