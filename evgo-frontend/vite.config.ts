import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    // Local-dev-only CORS workaround: proxies /api/* to the gateway so
    // requests are same-origin from the browser's perspective. If you use
    // this, set VITE_API_BASE_URL=/api in your .env instead of the gateway's
    // full URL. Prefer fixing CORS on the gateway itself for anything beyond
    // local development — this proxy won't exist in a production build.
    //
    // IMPORTANT: Do NOT rewrite the path — the gateway expects /api/** paths
    // and uses StripPrefix=1 internally to remove the /api prefix before
    // forwarding to downstream services.
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  }
})
