import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const repositoryBase = '/landingpage-parallax/'

export default defineConfig({
  base: process.env.VITE_GITHUB_PAGES === 'true' ? repositoryBase : '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/setupTests.ts'],
    coverage: {
      reporter: ['text', 'json-summary', 'html'],
    },
  },
})
