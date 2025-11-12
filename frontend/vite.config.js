import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/tabnews-in-levels/', // Base path para GitHub Pages
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})
