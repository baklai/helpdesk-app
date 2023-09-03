import { fileURLToPath, URL } from 'node:url';

import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';

const { VITE_API_BASE_URL } = loadEnv('', process.cwd());

export default defineConfig({
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@@': fileURLToPath(new URL('./', import.meta.url))
    }
  }
  // server: {
  //   proxy: {
  //     '/api/v1': {
  //       target: VITE_API_BASE_URL,
  //       changeOrigin: true,
  //       secure: false,
  //       rewrite: (path) => path.replace(/^\/api\/v1/, '/api/v1')
  //     }
  //   }
  // }
});
