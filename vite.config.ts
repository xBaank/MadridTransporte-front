import {defineConfig} from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import {VitePWA} from "vite-plugin-pwa";
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "prompt",
      injectRegister: "auto",
      devOptions: {
        enabled: true,
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,jpg,jpeg,svg,json}"],
        maximumFileSizeToCacheInBytes: 10000000,
      },
    }),
  ],
   build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Example: Put React-related packages in a "react-vendor" chunk
            if (id.includes('react')) {
              return 'react-vendor';
            }

            // Everything else from node_modules goes into "vendor"
            return 'vendor';
          }

          // Optionally chunk your own files
          if (id.includes('/src/utils/')) {
            return 'utils';
          }
        },
      },
    },
  }
});
