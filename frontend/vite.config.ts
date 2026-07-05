import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [
    react(),
    tailwindcss()
  ],
  build: {
    rollupOptions: {
      output: {
        // Split the two heaviest libraries into their own long-lived chunks so
        // they cache independently of app code and never bloat the entry bundle.
        // recharts drags in the d3-* family, so group them together.
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('maplibre-gl')) return 'maplibre'
            if (id.includes('recharts') || id.includes('/d3-') || id.includes('victory-vendor'))
              return 'charts'
            if (id.includes('framer-motion') || id.includes('motion-dom') || id.includes('motion-utils'))
              return 'motion'
          }
        },
      },
    },
  },
  server: {
    port: 5173,
    host: true,
    allowedHosts: ['frontend', 'localhost'],
  }
})
