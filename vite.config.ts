/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  // GitHub Pages serves the app from /<repository>/; dev and preview use the same path.
  base: '/programme-12-semaines/',
  plugins: [
    react(),
    VitePWA({
      // "prompt" without a prompt: a new version waits until the app is fully closed,
      // so an update never reloads the page in the middle of a timer.
      registerType: 'prompt',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Amélia',
        short_name: 'Amélia',
        description: 'Ton programme de 12 semaines : renfo, course, posture et repas, jour par jour.',
        lang: 'fr',
        start_url: '.',
        scope: '.',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#f1efec',
        theme_color: '#f1efec',
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Only the Latin font subsets are used; the others never load.
        globPatterns: ['**/*.{js,css,html}', 'assets/*-latin-*.woff2'],
      },
    }),
  ],
  test: {
    // The daylight saving tests rely on French clock changes.
    env: { TZ: 'Europe/Paris' },
  },
})
