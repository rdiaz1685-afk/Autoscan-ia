import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Carga las variables de entorno del archivo .env
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      'process.env': {
        // Prioriza la llave del archivo .env, luego la de la terminal, o vacío
        API_KEY: JSON.stringify(env.API_KEY || process.env.API_KEY || '')
      }
    }
  };
});
