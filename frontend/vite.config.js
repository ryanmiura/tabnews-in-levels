import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Base path para desenvolvimento local
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})
