import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/v1',
  server: {
    proxy: {
      '/api': 'https://deep.cooking',
    },
  },
});
