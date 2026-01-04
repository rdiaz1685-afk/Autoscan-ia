import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY || '')
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      rollupOptions: {
        external: ['fsevents'], // Evita que Rollup intente resolver este módulo de macOS
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom', '@google/genai'],
          },
        },
      },
    },
    optimizeDeps: {
      exclude: ['fsevents']
    }
  };
});
