import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const parsePort = (value, fallback) => {
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback
}

const devHost = process.env.VITE_DEV_SERVER_HOST || 'localhost'
const devPort = parsePort(process.env.VITE_DEV_SERVER_PORT, 5173)
const hmrHost = process.env.VITE_HMR_HOST || devHost
const hmrPort = parsePort(process.env.VITE_HMR_PORT, devPort)

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: devHost,
    port: devPort,
    hmr: {
      host: hmrHost,
      port: hmrPort,
      clientPort: hmrPort,
      protocol: 'ws',
    },
  },
})
