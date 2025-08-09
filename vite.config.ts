import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
        exportType: 'named',
        namedExport: 'ReactComponent',
      },
    })
  ],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      onwarn(warning, warn) {
        // Silence eval warnings coming from @react-jvectormap/core dist build only
        const message = (warning && (warning.message || '')) as string;
        const id = (warning && (warning.id || (warning.loc && warning.loc.file) || '')) as string;
        if (
          message.includes('Use of eval') &&
          /@react-jvectormap[\\\/]core[\\\/]dist[\\\/]index\.js/.test(id)
        ) {
          return;
        }
        warn(warning);
      },
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          charts: ['apexcharts', 'react-apexcharts'],
          calendar: [
            '@fullcalendar/core',
            '@fullcalendar/react',
            '@fullcalendar/daygrid',
            '@fullcalendar/list',
            '@fullcalendar/timegrid',
            '@fullcalendar/interaction',
          ],
          dnd: ['react-dnd', 'react-dnd-html5-backend'],
        }
      }
    }
  },
  server: {
    port: 5173,
    host: true
  },
  preview: {
    port: 4173,
    host: true
  }
})
