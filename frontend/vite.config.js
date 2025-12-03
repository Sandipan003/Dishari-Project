import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost/Dishari%20Project/backend',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
