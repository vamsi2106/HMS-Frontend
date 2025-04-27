import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: 'http://127.0.0.1:8000',
  //       changeOrigin: true,
  //       secure: false,
  //       // rewrite: (path) => path.replace(/^\/api/, ''),
  //     },
  //   },
  // },
  server: {
    https: false, // Allow HTTP APIs for now
    proxy: {
      '/api': {
        target: 'http://54.211.193.123:8000',
        changeOrigin: true,
        secure: false,
      }
    }
  },  
  optimizeDeps: {

    exclude: ['lucide-react'],
  },
});
