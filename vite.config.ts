import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        id: '/',
        name: 'Liga de Volley Parana Central',
        short_name: 'Volley Parana',
        description: 'Gestion de equipos y fixture para la Liga Parana Central',
        theme_color: '#0f172a',
        start_url: '/diario',
        display: 'standalone',
<<<<<<< HEAD
        shortcuts: [
          {
            name: 'Ver Diario y Noticias',
            url: '/diario',
            icons: [{ src: 'pwa-192x192.png', sizes: '192x192' }]
          },
          {
            name: 'Panel Administrador',
            url: '/admin',
            icons: [{ src: 'pwa-192x192.png', sizes: '192x192' }]
          }
        ],
=======
>>>>>>> 30bb02147ea73dbeeb14506130ce444d5228ef46
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      devOptions: {
        enabled: true
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
