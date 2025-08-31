import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  // Only use proxy in development
  ...(mode === 'development' && {
    server: {
      proxy: {
        '/backend': {
          target: 'http://localhost/Tsky/Tsky-react/backend',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/backend/, '')
        }
      }
    }
  })
}))
