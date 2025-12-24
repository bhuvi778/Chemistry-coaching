import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    copyPublicDir: true,
    // Force unique hashes on every build
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name]-[hash]-${Date.now()}.js`,
        chunkFileNames: `assets/[name]-[hash]-${Date.now()}.js`,
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.js')) {
            return `assets/[name]-[hash]-${Date.now()}.js`;
          }
          return `assets/[name]-[hash].[ext]`;
        }
      }
    }
  }
})
