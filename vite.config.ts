import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // IMPORTANT: set base to your repository name for GitHub Pages
  // Example URL: https://aura44422.github.io/noviy-center21.github.io/
  // Base must be "/noviy-center21.github.io/"
  base: '/noviy-center21.github.io/'
})
