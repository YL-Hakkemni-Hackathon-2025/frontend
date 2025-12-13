import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite({ autoCodeSplitting: true }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true, // Allow network access
    proxy: {
      '/api': {
        target: 'https://hakkemni-api.internalizable.dev',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path,
      },
    },
  },
})
