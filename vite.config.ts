import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Serving from repository Pages: https://aura44422.github.io/noviy-center21.github.io/
  base: '/noviy-center21.github.io/'
})
