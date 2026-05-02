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
    target: 'esnext',            // Smaller modern output -- no legacy polyfills
    chunkSizeWarningLimit: 1000,
    cssCodeSplit: true,
    reportCompressedSize: false, // Skip gzip reporting to speed up builds
    rollupOptions: {
      output: {
        manualChunks(id) {
          // React core — rarely changes, cached longest
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/') ||
              id.includes('node_modules/scheduler/')) {
            return 'react-core';
          }
          // React Router — needed on every page, standalone chunk for fast caching
          if (id.includes('node_modules/react-router') || id.includes('node_modules/react-router-dom')) {
            return 'router';
          }
          // react-icons — large icon library, own chunk so app updates don't bust it
          if (id.includes('node_modules/react-icons/')) {
            return 'icons';
          }
          // Split heavy admin-only libs (Quill) -- only loaded on admin pages
          if (id.includes('node_modules/quill') || id.includes('node_modules/react-quill')) {
            return 'quill-vendor';
          }
          // Split PDF viewer libs -- large and only needed on PDF pages
          if (id.includes('node_modules/pdfjs-dist') || id.includes('node_modules/react-pdf') || id.includes('node_modules/@react-pdf')) {
            return 'pdf-vendor';
          }
          // mammoth (Word doc parsing) — only used on specific pages
          if (id.includes('node_modules/mammoth')) {
            return 'mammoth-vendor';
          }
          // Everything else (axios, hot-toast, etc.) in vendor
          if (id.includes('node_modules/')) {
            return 'vendor';
          }
        }
      }
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
