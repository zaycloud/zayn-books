import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Proxy API requests to Backend to avoid CORS issues in dev
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
})
