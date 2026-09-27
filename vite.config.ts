import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: { chunkSizeWarningLimit: 700 },
  // Carregadas sob demanda no import: sem isso o Vite de dev as descobre na hora e recarrega a página no meio da importação.
  optimizeDeps: { include: ['jszip', 'fzstd', 'sql.js', 'pdfjs-dist'] },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
