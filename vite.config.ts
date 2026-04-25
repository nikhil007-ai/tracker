import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  const isProduction = mode === 'production';
  // For GitHub Pages deployment: https://username.github.io/tracker/
  const baseUrl = process.env.GITHUB_PAGES === 'true' ? '/tracker/' : '/';

  return {
    base: baseUrl,
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      target: 'ES2020',
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: isProduction,
        },
      },
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom'],
            'vendor-ui': ['lucide-react', 'motion'],
            'vendor-db': ['dexie', 'dexie-react-hooks'],
          },
        },
      },
      cssCodeSplit: true,
      reportCompressedSize: false,
      chunkSizeWarningLimit: 600,
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
