import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Use relative base so assets work on subpaths (e.g., GitHub Pages project site)
  base: './',
})
