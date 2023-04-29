import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'https://deep.cooking',
      '/api_v2': 'https://deep.cooking',
    },
  },
});
