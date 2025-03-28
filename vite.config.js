import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: 'index.html',
      },
    },
    // Copy prompt files to the build
    copyPublicDir: true,
  },
  publicDir: 'public',
  server: {
    port: 5173,
  },
  // Add static file handling
  assetsInclude: ['**/*.txt'],
  // Configure static file serving
  resolve: {
    alias: {
      '@prompt': resolve(__dirname, 'prompt'),
    },
  },
}); 