# vite.config.js
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ command, mode }) => {
  // Load env file based on mode
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    server: {
      host: true,
      port: 3005,
      strictPort: true,
    },
    preview: {
      host: '0.0.0.0',
      port: 3005,
      strictPort: true,
      proxy: {},  // Empty proxy to help with host restrictions
      cors: true, // Enable CORS
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    },
    build: {
      outDir: 'dist',
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
          },
        },
      },
    },
    define: {
      'process.env.VITE_PLEX_SERVER_URL': JSON.stringify(env.VITE_PLEX_SERVER_URL),
      'process.env.VITE_PLEX_TOKEN': JSON.stringify(env.VITE_PLEX_TOKEN),
    },
}