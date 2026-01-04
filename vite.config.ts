import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Carga variables de .env local y del sistema (Vercel)
  const env = loadEnv(mode, process.cwd(), '');
  
  // Determinamos la API_KEY buscando en todas las fuentes posibles
  const apiKey = env.API_KEY || process.env.API_KEY || '';

  return {
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(apiKey)
    }
  };
});
