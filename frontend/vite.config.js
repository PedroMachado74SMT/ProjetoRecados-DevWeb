import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],

  server: {
    host: '0.0.0.0',

    allowedHosts: ['.app.github.dev'],

    proxy: {
      '/api': {
        target: process.env.BACKEND_URL || 'http://localhost:8000',
        changeOrigin: true
      },

      '/sanctum': {
        target: process.env.BACKEND_URL || 'http://localhost:8000',
        changeOrigin: true
      }
    }
  }
})