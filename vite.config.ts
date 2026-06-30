import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    warmup: {
      clientFiles: [
        './src/main.tsx',
        './src/App.tsx',
        './src/pages/public/Home.tsx',
        './src/pages/dashboard/Overview.tsx',
      ],
    },
  },
  optimizeDeps: {
    include: [
      'react-router-dom',
      'zustand',
      'framer-motion',
      'lucide-react',
      'recharts',
      'leaflet',
      'react-leaflet',
    ],
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          // never split react/react-dom — must stay in same chunk as anything that uses hooks
          if (id.includes('/react/') || id.includes('/react-dom/') || id.includes('scheduler')) return undefined;
          if (id.includes('recharts')) return 'vendor-recharts';
          if (id.includes('leaflet') || id.includes('react-leaflet')) return 'vendor-maps';
          if (id.includes('framer-motion')) return 'vendor-motion';
          if (id.includes('lucide-react')) return 'vendor-icons';
          if (id.includes('react-router')) return 'vendor-router';
          return undefined;
        },
      },
    },
    chunkSizeWarningLimit: 800,
  },
})
