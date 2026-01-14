import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import cesium from 'vite-plugin-cesium'

export default defineConfig({
  plugins: [react(), cesium()],
  build: {
    outDir: 'dist',
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Your backend server address
        changeOrigin: true,
        secure: false,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (_proxyReq, req, _res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        },
      },
    },
    fs: {
      // Allow serving files from one level up to the project root
      allow: ['..']
    }
  },
  resolve: {
    alias: {
      // This alias helps with Cesium imports
      cesium: 'cesium'
    }
  },
  optimizeDeps: {
    include: ['cesium']
  }
})