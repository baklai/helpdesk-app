import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';

import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { createHtmlPlugin } from 'vite-plugin-html';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    createHtmlPlugin({
      minify: true,
      inject: {
        data: {
          APP_BASE_URL: '/',
          APP_BASE_IMG: '/img/preview.png'
        }
      }
    }),
    VitePWA({
      injectRegister: 'auto',
      registerType: 'autoUpdate',
      workbox: {
        sourcemap: true
      },
      includeAssets: ['favicon.ico'],
      manifest: {
        name: 'Helpdesk',
        short_name: 'HD',
        description: 'Helpdesk - Web application of technical support',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/img/pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png'
          },
          {
            src: '/img/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/img/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@@': fileURLToPath(new URL('./', import.meta.url))
    }
  },
  build: {
    chunkSizeWarningLimit: 1000
  },
  preview: {
    port: 5173,
    host: true,
    cors: true,
    open: false,
    strictPort: true
  }
});
