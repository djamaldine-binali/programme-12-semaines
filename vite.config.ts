/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  test: {
    // The daylight saving tests rely on French clock changes.
    env: { TZ: 'Europe/Paris' },
  },
})
